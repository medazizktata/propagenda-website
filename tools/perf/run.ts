import { checkBundle } from './check-bundle';
import { checkPublicAssets } from './check-public-assets';
import { checkStaticContent } from './check-static-content';
import { checkVideos } from './check-videos';
import { exitFromResults, printResult } from './lib/runner';

const args = new Set(process.argv.slice(2));
const skipBundle = args.has('--skip-bundle');
const skipLighthouse = args.has('--skip-lighthouse');

async function main() {
  console.log('Propagenda perf checks');
  console.log('  Bundle UI:  pnpm analyze          (Next 16 Turbopack analyzer)');
  console.log('  Prod LHCI:  pnpm perf:lhci        (requires check:build first)');
  console.log('  E2E vitals: pnpm test:perf\n');

  const results = [
    checkStaticContent(),
    checkVideos(),
    checkPublicAssets(),
    ...(skipBundle ? [] : [checkBundle()]),
  ];

  for (const result of results) {
    console.log(`\n[${result.name}]`);
    printResult(result);
  }

  if (!skipLighthouse && args.has('--lighthouse')) {
    const { runLighthouse } = await import('./lighthouse');
    const lh = await runLighthouse();
    console.log(`\n[${lh.name}]`);
    printResult(lh);
    results.push(lh);
  }

  exitFromResults(results);
}

main();
