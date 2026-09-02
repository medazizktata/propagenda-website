/**
 * Hard fail if any file under `public/` exceeds Cloudflare Workers' static asset
 * limit (25 MiB). Catches oversized videos before CF Builds / wrangler deploy.
 *
 * @see https://developers.cloudflare.com/workers/static-assets/
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');
/** Cloudflare Workers individual asset size limit. */
const MAX_BYTES = 25 * 1024 * 1024;

function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MiB`;
}

function main() {
  const files = walk(PUBLIC_DIR);
  const offenders = files
    .map((path) => ({ path, size: statSync(path).size }))
    .filter((f) => f.size > MAX_BYTES)
    .sort((a, b) => b.size - a.size);

  if (offenders.length) {
    console.error(
      `❌ Cloudflare Workers asset limit is ${formatBytes(MAX_BYTES)}. Oversized public files:\n`,
    );
    for (const { path, size } of offenders) {
      console.error(`  ${relative(ROOT, path)} — ${formatBytes(size)}`);
    }
    console.error(
      '\nRe-encode/compress or host outside Worker assets (e.g. R2/Stream) before deploy.',
    );
    process.exit(1);
  }

  console.log(
    `✓ Worker assets OK — ${files.length} public files, all ≤ ${formatBytes(MAX_BYTES)}`,
  );
}

main();
