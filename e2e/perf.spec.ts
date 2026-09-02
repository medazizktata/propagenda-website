import { test, expect } from '@playwright/test';
import budgets from '../tools/perf/budgets.json';
import { measureWebVitals } from './helpers/web-vitals';

const ROUTES = ['/', '/about', '/services', '/work', '/contact'] as const;

async function prime(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('pg-init-loader-seen', '1');
    } catch {
      /* ignore */
    }
  });
}

test.describe('web vitals smoke (dev server)', () => {
  for (const route of ROUTES) {
    test(`${route} stays within loose CWV budgets`, async ({ page }) => {
      test.skip(test.info().project.name !== 'desktop', 'desktop perf smoke only');

      await prime(page);
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (const f of [0.5, 1]) {
          window.scrollTo({ top: h * f, behavior: 'instant' as ScrollBehavior });
          await new Promise((r) => setTimeout(r, 300));
        }
      });

      const vitals = await measureWebVitals(page);

      // Dev/Turbopack runs are noisier than prod — use 1.5× budgets as a regression guard.
      const lcpCap = budgets.cwv.lcpMs * 1.5;
      const clsCap = budgets.cwv.cls * 2;

      expect(vitals.lcp, `LCP ${vitals.lcp.toFixed(0)}ms on ${route}`).toBeLessThan(lcpCap);
      expect(vitals.cls, `CLS ${vitals.cls.toFixed(3)} on ${route}`).toBeLessThan(clsCap);
    });
  }
});
