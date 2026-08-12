import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke guardrails for the marketing site. Reuses the already-running dev server
 * on :4000 when present (the usual local setup); starts one otherwise.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: 0,
  /* One worker: the local target is a dev server — parallel first-compiles produce
     transient hydration flakes that have nothing to do with the app. */
  workers: 1,
  globalSetup: './e2e/global-setup.ts',
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
