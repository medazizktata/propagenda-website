import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:4000/work/sterling-cars';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.bringToFront();
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1200);

// Scroll driven entirely inside the page's own JS (via Lenis's real API, not a raw
// scrollTo and not an externally-simulated wheel event) -- no Playwright/CDP round-trips
// during the measured window at all, isolating page-internal cost from automation overhead.
const result = await page.evaluate(async () => {
  const frames = [];
  const longtasks = [];
  let collecting = true;
  function loop(t) { if (collecting) { frames.push(t); requestAnimationFrame(loop); } }
  requestAnimationFrame(loop);
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) longtasks.push({ start: Math.round(e.startTime), duration: Math.round(e.duration) });
    }).observe({ entryTypes: ['longtask'] });
  } catch {}

  const lenis = window.__lenis;
  const target = Math.round(window.innerHeight * 2.2);
  if (lenis) {
    lenis.scrollTo(target, { duration: 2 });
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
  await new Promise((r) => setTimeout(r, 3500));
  collecting = false;
  await new Promise((r) => requestAnimationFrame(r));

  const deltas = [];
  for (let i = 1; i < frames.length; i++) deltas.push(frames[i] - frames[i - 1]);
  const over33 = deltas.filter((d) => d > 33).length;
  const worst = deltas.length ? Math.max(...deltas) : 0;
  return { totalFrames: deltas.length, over33, worstMs: Math.round(worst * 100) / 100, longtasks, usedLenis: !!lenis };
});

console.log(JSON.stringify(result, null, 2));
await page.waitForTimeout(500);
await browser.close();
