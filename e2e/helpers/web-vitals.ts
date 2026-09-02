import type { Page } from '@playwright/test';

type WebVitals = {
  lcp: number;
  fcp: number;
  cls: number;
  tbt: number;
};

/** Read Core Web Vitals from the Performance API (dev/prod smoke — not a Lighthouse substitute). */
export async function measureWebVitals(page: Page): Promise<WebVitals> {
  return page.evaluate(async () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;

    let lcp = 0;
    let cls = 0;

    try {
      const lcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          lcp = Math.max(lcp, entry.startTime);
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* unsupported */
    }

    try {
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (!e.hadRecentInput) cls += e.value ?? 0;
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* unsupported */
    }

    await new Promise((r) => setTimeout(r, 4000));

    const longTasks = performance.getEntriesByType('longtask') as PerformanceEntry[];
    const tbt = longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0);

    return {
      lcp,
      fcp: nav?.domContentLoadedEventEnd ?? 0,
      cls,
      tbt,
    };
  });
}
