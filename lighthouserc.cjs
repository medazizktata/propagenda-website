/**
 * Lighthouse CI against the real production Worker, not `next start`.
 *
 * The site runs on Cloudflare Workers (OpenNext), so `pnpm perf:lhci` builds the Worker and serves
 * it with `opennextjs-cloudflare preview` (workerd, local D1) on :8791. `next start` was a Node
 * server with none of the bindings, which is not what visitors get.
 *
 * Mobile with Lighthouse's default simulated throttling (slow 4G, 4x CPU): the tougher and more
 * common case for this site's visitors. Three runs per URL; LHCI asserts on the median.
 *
 * `total-byte-weight` is the guard that matters most here: the home page once fetched a 6.6 MB
 * scroll-scrub video during load, which alone dragged simulated LCP from ~3 s to 8+ s.
 */
const BASE = process.env.LHCI_BASE_URL ?? 'http://localhost:8791';
const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/events',
  '/work',
  '/work/video',
  '/contact',
];

const COMMON = {
  'categories:performance': ['warn', { minScore: 0.85 }],
  'categories:accessibility': ['error', { minScore: 0.9 }],
  'categories:best-practices': ['warn', { minScore: 0.9 }],
  'categories:seo': ['warn', { minScore: 0.9 }],
  'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
  'total-blocking-time': ['warn', { maxNumericValue: 300 }],
};

/** @type {import('@lhci/cli/src/config').LHCI.ServerCommandOptions} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      ...(process.env.LHCI_BASE_URL
        ? {}
        : {
            startServerCommand: 'pnpm exec opennextjs-cloudflare preview --port 8791',
            startServerReadyPattern: 'Ready on',
            startServerReadyTimeout: 180_000,
          }),
      url: ROUTES.map((route) => `${BASE}${route}`),
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      // Two disjoint URL groups so each route gets exactly one byte budget.
      assertMatrix: [
        {
          matchingUrlPattern: '^(?!.*/work/video$).*$',
          assertions: {
            ...COMMON,
            // Bytes fetched during load. Every route sits well under this after the 2026-09-26
            // pass; a large media file slipping back into the load path trips it.
            'total-byte-weight': ['error', { maxNumericValue: 3 * 1024 * 1024 }],
          },
        },
        {
          // The film page's hero deliberately plays a ~1.4 MB silent loop of the showreel. It used
          // to stream the 6.4 MB film instead (5.6 MB on load), which this still catches.
          matchingUrlPattern: '/work/video$',
          assertions: {
            ...COMMON,
            'total-byte-weight': ['error', { maxNumericValue: 4 * 1024 * 1024 }],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: './reports/lhci',
    },
  },
};
