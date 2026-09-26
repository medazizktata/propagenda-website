/**
 * Small copies of the case-study images for the /work hero wall.
 *
 * The wall shows each image as a ~quarter-width tile behind a dark scrim, but used to load the
 * full 1920px originals (100-500 KB each, ~4 MB during page load). This writes a 640px-wide WebP
 * for every image under public/images/work/ to public/images/work-thumbs/ (same relative path,
 * .webp) and a manifest the wall reads to know which thumbs exist; anything without a thumb
 * (e.g. an image added later through the CMS) falls back to the full file.
 *
 * Thumbs are resized from the already-watermarked files, so they carry the same mark, scaled.
 * Never run the watermark tool on them.
 *
 * Usage: pnpm perf:thumbs   (re-run after adding or replacing work images)
 */
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import sharp from 'sharp';

const SRC = join(process.cwd(), 'public/images/work');
const OUT = join(process.cwd(), 'public/images/work-thumbs');
const MANIFEST = join(process.cwd(), 'content/workThumbs.json');
/** Folders never thumbnailed: brands that must not be shown (Emirates Agro is hidden on purpose). */
const EXCLUDE = new Set(['emirates-agro']);
const WIDTH = 640;
const QUALITY = 72;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  const files = walk(SRC).filter(
    (f) => /\.(webp|jpe?g|png)$/i.test(f) && !EXCLUDE.has(relative(SRC, f).split(/[\\/]/)[0]),
  );
  const keys: string[] = [];
  let before = 0;
  let after = 0;
  for (const file of files) {
    const rel = relative(SRC, file).split('\\').join('/');
    const out = join(OUT, rel.replace(/\.(webp|jpe?g|png)$/i, '.webp'));
    mkdirSync(dirname(out), { recursive: true });
    const info = await sharp(file)
      .rotate()
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);
    before += statSync(file).size;
    after += info.size;
    keys.push(rel);
  }
  keys.sort();
  writeFileSync(MANIFEST, `${JSON.stringify(keys, null, 1)}\n`);
  console.log(
    `${keys.length} thumbs -> public/images/work-thumbs (${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB), manifest content/workThumbs.json`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
