import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { LIGHTHOUSE_BUDGETS, LIGHTHOUSE_ROUTES, LOCAL_URL, PATHS } from './config';
import { isMain } from './lib/is-main';
import { fail, ok } from './lib/format';
import type { CheckResult } from './lib/runner';

type LighthouseFlags = Parameters<typeof lighthouse>[2];

export async function runLighthouse(options?: {
  routes?: readonly string[];
  writeReports?: boolean;
}): Promise<CheckResult> {
  const result: CheckResult = { name: 'lighthouse', errors: [], warnings: [] };
  const routes = options?.routes ?? LIGHTHOUSE_ROUTES;
  const writeReports = options?.writeReports ?? true;

  if (writeReports) mkdirSync(PATHS.reports, { recursive: true });

  const flags: LighthouseFlags = {
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };

  for (const route of routes) {
    const url = `${LOCAL_URL.replace(/\/$/, '')}${route}`;
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
    const reportPath = join(PATHS.reports, `${slug}.report.html`);

    try {
      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
      try {
        const runner = await lighthouse(url, {
          ...flags,
          port: chrome.port,
          output: writeReports ? 'html' : 'json',
        });

        if (writeReports && runner?.report) {
          writeFileSync(reportPath, runner.report as string);
        }

        const categories = runner?.lhr.categories ?? {};
        const perf = Math.round((categories.performance?.score ?? 0) * 100);
        const a11y = Math.round((categories.accessibility?.score ?? 0) * 100);
        const bp = Math.round((categories['best-practices']?.score ?? 0) * 100);
        const seo = Math.round((categories.seo?.score ?? 0) * 100);

        ok(
          `${route} — perf ${perf}, a11y ${a11y}, bp ${bp}, seo ${seo}${writeReports ? ` → reports/${slug}.report.html` : ''}`,
        );

        if (perf < LIGHTHOUSE_BUDGETS.minPerformance) {
          result.warnings.push(`${route} performance ${perf} < ${LIGHTHOUSE_BUDGETS.minPerformance}`);
        }
        if (a11y < LIGHTHOUSE_BUDGETS.minAccessibility) {
          result.warnings.push(`${route} accessibility ${a11y} < ${LIGHTHOUSE_BUDGETS.minAccessibility}`);
        }
        if (bp < LIGHTHOUSE_BUDGETS.minBestPractices) {
          result.warnings.push(`${route} best-practices ${bp} < ${LIGHTHOUSE_BUDGETS.minBestPractices}`);
        }
        if (seo < LIGHTHOUSE_BUDGETS.minSeo) {
          result.warnings.push(`${route} seo ${seo} < ${LIGHTHOUSE_BUDGETS.minSeo}`);
        }
      } finally {
        await chrome.kill();
      }
    } catch (error) {
      fail(`${route}: ${error instanceof Error ? error.message : String(error)}`);
      result.errors.push(
        `${route}: Lighthouse failed — is the dev server running at ${LOCAL_URL}? (pnpm dev)`,
      );
    }
  }

  return result;
}

if (isMain('lighthouse')) {
  const { printResult, exitFromResults } = await import('./lib/runner');
  const result = await runLighthouse();
  printResult(result);
  exitFromResults([result]);
}
