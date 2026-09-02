import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import { PATHS } from './config';
import { isMain } from './lib/is-main';
import { ok, warn } from './lib/format';

type OutputSpec = {
  file: string;
  width: number;
  format: 'webp' | 'avif';
  quality: number;
};

type ImageJob = {
  input: string;
  outputs: OutputSpec[];
};

/** Declarative image jobs — ELM-style Sharp pipeline for static marketing assets. */
const JOBS: ImageJob[] = [
  {
    input: 'images/brand/og-share.jpg',
    outputs: [
      { file: 'images/brand/og-share.webp', width: 1200, format: 'webp', quality: 82 },
      { file: 'images/brand/og-share.avif', width: 1200, format: 'avif', quality: 52 },
    ],
  },
  {
    input: 'images/brand/monogram-glow.jpg',
    outputs: [
      { file: 'images/brand/monogram-glow.webp', width: 1920, format: 'webp', quality: 82 },
      { file: 'images/brand/monogram-glow.avif', width: 1920, format: 'avif', quality: 52 },
    ],
  },
  ...['showreel-marketing', 'reel-branding'].flatMap((name) => ({
    input: `images/video-posters/${name}.jpg`,
    outputs: [
      { file: `images/video-posters/${name}.webp`, width: 1280, format: 'webp' as const, quality: 78 },
      { file: `images/video-posters/${name}.avif`, width: 1280, format: 'avif' as const, quality: 48 },
    ],
  })),
];

async function encode(
  inputPath: string,
  outPath: string,
  { width, format, quality }: OutputSpec,
): Promise<void> {
  mkdirSync(dirname(outPath), { recursive: true });
  let pipeline = sharp(inputPath).rotate().resize({ width, withoutEnlargement: true });

  pipeline =
    format === 'webp'
      ? pipeline.webp({ quality, effort: 4 })
      : pipeline.avif({ quality, effort: 4 });

  await pipeline.toFile(outPath);
  const meta = await sharp(outPath).metadata();
  ok(`${outPath.replace(PATHS.public + '/', '')} (${meta.width}×${meta.height})`);
}

export async function optimizeImages(): Promise<void> {
  let processed = 0;

  for (const job of JOBS) {
    const inputPath = resolve(PATHS.public, job.input);
    if (!existsSync(inputPath)) {
      warn(`Skip missing ${job.input}`);
      continue;
    }

    for (const output of job.outputs) {
      await encode(inputPath, resolve(PATHS.public, output.file), output);
      processed += 1;
    }
  }

  console.log(`\nOptimized ${processed} derivative(s).`);
}

if (isMain('optimize-images')) {
  await optimizeImages();
}
