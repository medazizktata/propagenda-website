import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { HERO_VIDEO, PATHS, VIDEO_BUDGETS } from './config';
import { rel, walkFiles } from './lib/fs';
import { formatBytes, ok } from './lib/format';
import { probeVideo } from './lib/probe-video';
import { isMain } from './lib/is-main';
import type { CheckResult } from './lib/runner';

export function checkVideos(): CheckResult {
  const result: CheckResult = { name: 'videos', errors: [], warnings: [] };

  if (!existsSync(PATHS.videos)) {
    result.errors.push(`Missing ${PATHS.videos}`);
    return result;
  }

  const files = walkFiles(PATHS.videos).filter((f) => f.endsWith('.mp4'));

  for (const file of files) {
    const name = rel(PATHS.root, file);
    const size = statSync(file).size;
    const meta = probeVideo(file);

    if (size > VIDEO_BUDGETS.maxBytes) {
      result.errors.push(
        `${name} is ${formatBytes(size)} — exceeds Cloudflare Workers asset limit (${formatBytes(VIDEO_BUDGETS.maxBytes)})`,
      );
    }

    if (!meta) {
      result.warnings.push(`${name}: install ffprobe to inspect resolution (brew install ffmpeg)`);
      ok(`${name} ${formatBytes(size)} (no ffprobe)`);
      continue;
    }

    const label = `${name} ${meta.width}×${meta.height} @ ${meta.fps.toFixed(0)}fps, ${meta.duration.toFixed(1)}s, ${formatBytes(size)}`;
    const basename = file.split('/').pop() ?? '';
    const isHero = basename === HERO_VIDEO;

    if (isHero && Math.max(meta.width, meta.height) < VIDEO_BUDGETS.minHeroWidth) {
      result.warnings.push(
        `Hero video ${basename} is ${meta.width}×${meta.height}, below ${VIDEO_BUDGETS.minHeroWidth}px long edge`,
      );
    } else if (!isHero && Math.max(meta.width, meta.height) < VIDEO_BUDGETS.minWidth) {
      result.warnings.push(`${basename} is below ${VIDEO_BUDGETS.minWidth}px on the long edge`);
    }

    ok(label);
  }

  return result;
}

if (isMain('check-videos')) {
  const { printResult, exitFromResults } = await import('./lib/runner');
  const result = checkVideos();
  printResult(result);
  exitFromResults([result]);
}
