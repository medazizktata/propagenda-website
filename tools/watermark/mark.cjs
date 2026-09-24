// Propagenda work watermark (approved 2026-09-25, style "A + B"): a small corner monogram (~55%)
// plus a large faint centre monogram (~10%), both white with a soft dark halo so they read on
// light and dark work. One function for images and for the PNG overlay ffmpeg burns into video,
// so every medium carries the identical mark. ALWAYS feed it originals, never marked files.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG = fs.readFileSync(path.join(__dirname, '../../public/images/brand/logo-monogram-knockout.svg'), 'utf8');
const INNER = SVG.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const VB_W = 126.868, VB_H = 132.068;

function overlaySvg(W, H) {
  const short = Math.min(W, H);
  const mark = (x, y, w, op) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(w / VB_W).toFixed(5)})" opacity="${op}">${INNER}</g>`;
  const a = short * 0.075, pad = a * 0.45;                       // A: corner
  const b = short * 0.42;                                        // B: centre
  const halo = Math.max(1.5, short * 0.0035);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><filter id="h" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${halo.toFixed(2)}" flood-color="#000" flood-opacity="0.55"/></filter></defs>`
    + `<g filter="url(#h)">${mark(W - a - pad, H - a * (VB_H / VB_W) - pad, a, 0.55)}${mark((W - b) / 2, (H - b * (VB_H / VB_W)) / 2, b, 0.10)}</g></svg>`;
}

async function overlayPng(W, H) {
  return sharp(Buffer.from(overlaySvg(W, H))).resize(W, H, { fit: 'fill' }).png().toBuffer();
}

async function markImage(input, output) {
  const img = sharp(input, { failOn: 'error' }).rotate();
  const { width: W, height: H, format } = await sharp(input).rotate().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const composed = await img.composite([{ input: await overlayPng(W, H) }]).toBuffer();
  const out = sharp(composed);
  if (format === 'webp') await out.webp({ quality: 88, effort: 5 }).toFile(output);
  else if (format === 'jpeg') await out.jpeg({ quality: 88, mozjpeg: true }).toFile(output);
  else if (format === 'png') await out.png({ compressionLevel: 9 }).toFile(output);
  else throw new Error(`unsupported format ${format} for ${input}`);
  return { W, H, format };
}

module.exports = { overlaySvg, overlayPng, markImage };
