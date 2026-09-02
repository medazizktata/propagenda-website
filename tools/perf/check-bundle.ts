import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BUNDLE_BUDGETS, PATHS } from './config';
import { rel, walkFiles } from './lib/fs';
import { formatBytes, ok, warn } from './lib/format';
import { isMain } from './lib/is-main';
import type { CheckResult } from './lib/runner';

export function checkBundle(): CheckResult {
  const result: CheckResult = { name: 'bundle', errors: [], warnings: [] };
  const staticDir = join(PATHS.nextProd, 'static');

  if (!existsSync(staticDir)) {
    warn(`No prod build at ${PATHS.nextProd} — run pnpm check:build first`);
    return result;
  }

  const chunksDir = join(staticDir, 'chunks');
  if (!existsSync(chunksDir)) {
    result.warnings.push(`No chunks dir at ${chunksDir}`);
    return result;
  }

  const jsFiles = walkFiles(chunksDir).filter((f) => f.endsWith('.js'));
  let total = 0;
  let overBudget = 0;

  for (const file of jsFiles) {
    const size = statSync(file).size;
    total += size;
    if (size > BUNDLE_BUDGETS.maxChunkBytes) {
      overBudget += 1;
      result.warnings.push(
        `${rel(PATHS.root, file)} is ${formatBytes(size)} (budget ${formatBytes(BUNDLE_BUDGETS.maxChunkBytes)} per chunk)`,
      );
    }
  }

  if (total > BUNDLE_BUDGETS.maxTotalStaticJsBytes) {
    result.warnings.push(
      `Total static JS ${formatBytes(total)} exceeds ${formatBytes(BUNDLE_BUDGETS.maxTotalStaticJsBytes)}`,
    );
  }

  ok(`${jsFiles.length} JS chunks, ${formatBytes(total)} total${overBudget ? `, ${overBudget} over budget` : ''}`);
  return result;
}

if (isMain('check-bundle')) {
  const { printResult, exitFromResults } = await import('./lib/runner');
  const result = checkBundle();
  printResult(result);
  exitFromResults([result]);
}
