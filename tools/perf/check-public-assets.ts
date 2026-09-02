import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ASSET_BUDGETS, PATHS } from './config';
import { ext, rel, walkFiles } from './lib/fs';
import { formatBytes, ok } from './lib/format';
import { isMain } from './lib/is-main';
import type { CheckResult } from './lib/runner';

export function checkPublicAssets(): CheckResult {
  const result: CheckResult = { name: 'public-assets', errors: [], warnings: [] };

  if (!existsSync(PATHS.public)) {
    result.errors.push(`Missing ${PATHS.public}`);
    return result;
  }

  const files = walkFiles(PATHS.public);
  let rasterCount = 0;
  let heavyCount = 0;

  const videoExt = new Set(['.mp4', '.webm', '.mov']);

  for (const file of files) {
    const size = statSync(file).size;
    const relative = rel(PATHS.root, file);
    const extension = ext(file);

    if (!videoExt.has(extension) && size > ASSET_BUDGETS.maxAnyBytes) {
      result.warnings.push(`${relative} is ${formatBytes(size)} (>${formatBytes(ASSET_BUDGETS.maxAnyBytes)})`);
      heavyCount += 1;
    }

    if (!ASSET_BUDGETS.rasterExt.has(extension)) continue;
    rasterCount += 1;

    if (size > ASSET_BUDGETS.maxImageBytes) {
      result.warnings.push(
        `${relative} is ${formatBytes(size)} — consider WebP/AVIF via pnpm perf:images`,
      );
    }
  }

  ok(`Scanned ${files.length} public files (${rasterCount} rasters, ${heavyCount} heavy)`);
  return result;
}

if (isMain('check-public-assets')) {
  const { printResult, exitFromResults } = await import('./lib/runner');
  const result = checkPublicAssets();
  printResult(result);
  exitFromResults([result]);
}
