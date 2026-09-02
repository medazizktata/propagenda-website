/** @type {import('@lhci/cli/src/config').LHCI.ServerCommandOptions} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready|started server on',
      startServerReadyTimeout: 120_000,
      url: [
        'http://localhost:4000/',
        'http://localhost:4000/about',
        'http://localhost:4000/services',
        'http://localhost:4000/work',
        'http://localhost:4000/contact',
      ],
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './reports/lhci',
    },
  },
};
