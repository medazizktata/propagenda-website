#!/usr/bin/env node
// Watermark pipeline for new work media (run by .github/workflows/watermark-media.yml, or locally).
//
// Drop ORIGINALS under media-inbox/, at the path they should have in the R2 bucket:
//   media-inbox/case-study-media/acme/hero.webp  ->  R2 key case-study-media/acme/hero.webp
//   media-inbox/videos/work/acme-launch.mov      ->  R2 keys videos/work/acme-launch.mp4
//                                                    videos/previews/acme-launch.mp4
//                                                    video-posters/acme-launch.jpg
// Images keep their format; videos are re-encoded for the web (H.264 CRF 23, long side <= 1920,
// 30 fps, faststart, AAC 128k) with the mark burned in, plus an 8 s muted grid preview and a
// poster, both cut from the MARKED film so they carry the mark without being marked twice.
//
// Every output is checked before anything is uploaded: images must show the corner mark against
// the original (corner diff > 3x an unmarked control box + 2), videos must decode cleanly, keep
// their duration and show the mark on a sampled frame. One failure uploads nothing.
//
// Never marks a marked file: an input whose bytes equal what is already served at its key (a
// live asset downloaded and re-added) is refused, as is one matching any output recorded in the
// pipeline manifest. An input whose original is unchanged since the last run is skipped.
//
// Usage: node tools/watermark/process-inbox.cjs [--upload] [--all | <media-inbox/file> ...]
//   without --upload it only builds and verifies, into .watermark-out/.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const sharp = require('sharp');
const { overlayPng, markImage } = require('./mark.cjs');

const ROOT = path.resolve(__dirname, '../..');
const INBOX = path.join(ROOT, 'media-inbox');
const OUT = path.join(ROOT, '.watermark-out');
const BUCKET = 'propagenda-media';
const PUBLIC_BASE = 'https://pub-407269a8f50248bbbcef3c6a229fda51.r2.dev/';
const MANIFEST_KEY = '_pipeline/watermark-manifest.json';

const IMAGE = /\.(webp|jpe?g|png)$/i;
const VIDEO = /\.(mp4|mov|m4v|webm)$/i;
const TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.json': 'application/json' };

const args = process.argv.slice(2);
const upload = args.includes('--upload');
const all = args.includes('--all');
const named = args.filter((a) => !a.startsWith('--'));

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const log = (...m) => console.log(...m);
const summary = [];
let uploadStarted = false;

function wrangler(...a) {
  const r = spawnSync('pnpm', ['exec', 'wrangler', ...a], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`wrangler ${a.join(' ')} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
}

async function fetchPublic(key) {
  const res = await fetch(PUBLIC_BASE + key.split('/').map(encodeURIComponent).join('/'));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${key}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function listInputs() {
  const walk = (dir) =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
      : [];
  const files = all ? walk(INBOX) : named.map((f) => path.resolve(ROOT, f));
  return files.filter((f) => {
    const rel = path.relative(INBOX, f);
    if (rel.startsWith('..') || path.basename(f).startsWith('.') || /(^|\/)README\.md$/.test(rel)) return false;
    if (!fs.existsSync(f)) return false; // deleted in this push
    if (!IMAGE.test(f) && !VIDEO.test(f)) throw new Error(`unsupported file type: ${rel}`);
    return true;
  });
}

// Mean |diff| of a box (fractions of W/H) between two same-sized images, greyscale.
async function boxDiff(a, b, W, H, box) {
  const r = { left: Math.round(box[0] * W), top: Math.round(box[1] * H), width: Math.max(1, Math.round(box[2] * W)), height: Math.max(1, Math.round(box[3] * H)) };
  const [x, y] = await Promise.all([a, b].map((s) => sharp(s).rotate().resize(W, H, { fit: 'fill' }).extract(r).greyscale().raw().toBuffer()));
  let d = 0;
  for (let i = 0; i < x.length; i++) d += Math.abs(x[i] - y[i]);
  return d / x.length;
}

// The corner mark sits bottom-right (see mark.cjs); the top-left box never carries a mark, so it
// measures re-encode noise alone.
async function markCheck(orig, marked) {
  const { width: W, height: H } = await sharp(marked).rotate().metadata();
  const s = Math.min(W, H), a = s * 0.075, pad = a * 0.45;
  const corner = await boxDiff(orig, marked, W, H, [(W - a - pad) / W, (H - a * 1.04 - pad) / H, a / W, a / H]);
  const control = await boxDiff(orig, marked, W, H, [0.02, 0.02, a / W, a / H]);
  return { corner: +corner.toFixed(2), control: +control.toFixed(2), ok: corner > 3 * control + 2 };
}

function probe(file) {
  const r = JSON.parse(execFileSync('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_streams', '-show_format', file], { encoding: 'utf8' }));
  const v = r.streams.find((s) => s.codec_type === 'video');
  if (!v) throw new Error(`no video stream in ${file}`);
  const rot = Math.abs(Number(v.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? v.tags?.rotate ?? 0)) % 180;
  const [w, h] = rot === 90 ? [v.height, v.width] : [v.width, v.height];
  return { w, h, audio: r.streams.some((s) => s.codec_type === 'audio'), duration: Number(r.format.duration) };
}

function frameAt(file, t) {
  return execFileSync('ffmpeg', ['-v', 'error', '-ss', String(t), '-i', file, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 1 << 28 });
}

async function processImage(src, key) {
  const out = path.join(OUT, key);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await markImage(src, out);
  const check = await markCheck(fs.readFileSync(src), fs.readFileSync(out));
  if (!check.ok) throw new Error(`mark not detected on ${key} (corner ${check.corner} vs control ${check.control})`);
  return [{ key, file: out, check }];
}

async function processVideo(src, key) {
  const base = path.basename(key).replace(VIDEO, '');
  const filmKey = key.replace(VIDEO, '.mp4');
  const previewKey = `videos/previews/${base}.mp4`;
  const posterKey = `video-posters/${base}.jpg`;
  const [film, preview, poster] = [filmKey, previewKey, posterKey].map((k) => path.join(OUT, k));
  for (const f of [film, preview, poster]) fs.mkdirSync(path.dirname(f), { recursive: true });

  const info = probe(src);
  const scale = Math.min(1, 1920 / Math.max(info.w, info.h));
  const W = Math.round((info.w * scale) / 2) * 2, H = Math.round((info.h * scale) / 2) * 2;
  const overlay = path.join(OUT, `_overlay_${W}x${H}.png`);
  fs.writeFileSync(overlay, await overlayPng(W, H));

  const audio = info.audio ? ['-map', '0:a:0', '-c:a', 'aac', '-b:a', '128k', '-ac', '2'] : ['-an'];
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-i', overlay, '-filter_complex', `[0:v]scale=${W}:${H},fps=30[b];[b][1:v]overlay=0:0:format=auto[v]`,
    '-map', '[v]', ...audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', film], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', film, '-t', '8', '-vf', "scale='if(gt(iw,ih),640,if(eq(iw,ih),480,360))':-2,fps=24",
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', preview], { stdio: 'inherit' });
  const t = Math.min(1, info.duration / 2);
  await sharp(frameAt(film, t)).resize(1280, 1280, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toFile(poster);

  // Verify: decodes clean, duration kept, mark visible on a sampled frame vs the original's frame.
  const dec = spawnSync('ffmpeg', ['-v', 'error', '-i', film, '-f', 'null', '-'], { encoding: 'utf8' });
  if (dec.status !== 0 || dec.stderr.trim()) throw new Error(`${filmKey} does not decode cleanly: ${dec.stderr.slice(0, 300)}`);
  const outInfo = probe(film);
  if (Math.abs(outInfo.duration - info.duration) > 0.5) throw new Error(`${filmKey} duration ${outInfo.duration}s vs original ${info.duration}s`);
  const check = await markCheck(frameAt(src, t), frameAt(film, t));
  if (!check.ok) throw new Error(`mark not detected on ${filmKey} (corner ${check.corner} vs control ${check.control})`);
  return [
    { key: filmKey, file: film, check },
    { key: previewKey, file: preview },
    { key: posterKey, file: poster },
  ];
}

(async () => {
  const inputs = listInputs();
  if (inputs.length === 0) {
    log('No media in this change; nothing to do.');
    return;
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const manifestBuf = await fetchPublic(MANIFEST_KEY);
  const manifest = manifestBuf ? JSON.parse(manifestBuf.toString('utf8')) : { entries: {} };
  const markedShas = new Set(Object.values(manifest.entries).flatMap((e) => e.outputs.map((o) => o.sha256)));

  const planned = [];
  for (const src of inputs) {
    const inKey = path.relative(INBOX, src).split(path.sep).join('/');
    const buf = fs.readFileSync(src);
    const sha = sha256(buf);
    if (manifest.entries[inKey]?.originalSha256 === sha) {
      log(`skip  ${inKey} (already processed from this exact original)`);
      summary.push({ input: inKey, status: 'skipped: unchanged original' });
      continue;
    }
    if (markedShas.has(sha)) throw new Error(`${inKey} is a watermarked output (matches the pipeline manifest). Add the ORIGINAL instead.`);
    const liveKey = VIDEO.test(inKey) ? inKey.replace(VIDEO, '.mp4') : inKey;
    if (IMAGE.test(inKey)) {
      const live = await fetchPublic(liveKey);
      if (live && sha256(live) === sha) throw new Error(`${inKey} is byte-identical to the file already served at ${liveKey}, which is watermarked. Add the ORIGINAL instead.`);
    }
    log(`mark  ${inKey}`);
    const outputs = IMAGE.test(inKey) ? await processImage(src, inKey) : await processVideo(src, inKey);
    planned.push({ inKey, sha, outputs });
  }

  // Everything built and verified; only now touch the bucket.
  uploadStarted = upload && planned.length > 0;
  for (const { inKey, sha, outputs } of planned) {
    for (const o of outputs) {
      o.sha256 = sha256(fs.readFileSync(o.file));
      o.bytes = fs.statSync(o.file).size;
      if (upload) {
        wrangler('r2', 'object', 'put', `${BUCKET}/${o.key}`, '--file', o.file, '--content-type', TYPES[path.extname(o.key).toLowerCase()], '--remote');
        log(`put   ${o.key} (${(o.bytes / 1024).toFixed(0)} KB)`);
      }
    }
    manifest.entries[inKey] = {
      originalSha256: sha,
      processedAt: new Date().toISOString(),
      outputs: outputs.map(({ key, sha256: s, bytes }) => ({ key, sha256: s, bytes })),
    };
    summary.push({ input: inKey, status: upload ? 'uploaded' : 'built (not uploaded)', outputs: outputs.map((o) => ({ key: o.key, url: PUBLIC_BASE + o.key, check: o.check })) });
  }

  if (upload && planned.length > 0) {
    const mf = path.join(OUT, '_manifest.json');
    fs.writeFileSync(mf, JSON.stringify(manifest, null, 1));
    wrangler('r2', 'object', 'put', `${BUCKET}/${MANIFEST_KEY}`, '--file', mf, '--content-type', 'application/json', '--remote');
  }

  const md = ['### Watermarked media', '', '| Input | Status | Outputs |', '|---|---|---|',
    ...summary.map((s) => `| \`${s.input}\` | ${s.status} | ${(s.outputs ?? []).map((o) => `[${o.key}](${o.url})${o.check ? ` (mark ${o.check.corner} vs ${o.check.control})` : ''}`).join('<br>')} |`),
    '', 'Keys are ready to reference from D1 (bare key, e.g. `case-study-media/...`); the site resolves them against the R2 public base.'].join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  log('\n' + md);
})().catch((e) => {
  console.error(`\nFAILED: ${e.message}\n${uploadStarted ? 'Upload was in progress: some objects may be updated. The manifest was not written, so re-running reprocesses from the originals.' : 'Nothing was uploaded.'}`);
  process.exit(1);
});
