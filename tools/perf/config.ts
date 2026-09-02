import { join } from 'node:path';
import budgets from './budgets.json';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com';
export const SITE_NAME = 'Propagenda';

/** Local URL for Lighthouse / manual audits. */
export const LOCAL_URL = process.env.PERF_LOCAL_URL ?? 'http://localhost:4000';

export const PATHS = {
  root: process.cwd(),
  public: join(process.cwd(), 'public'),
  videos: join(process.cwd(), 'public/videos'),
  reports: join(process.cwd(), 'reports'),
  nextProd: join(process.cwd(), process.env.NEXT_DIST_DIR ?? '.next-prod'),
} as const;

/** Routes audited by Lighthouse (relative paths). */
export const LIGHTHOUSE_ROUTES = ['/', '/about', '/services', '/work', '/contact'] as const;

/** Hero / marketing video referenced in code. */
export const HERO_VIDEO = 'propagenda-marketing.mp4';

export const VIDEO_BUDGETS = {
  /** Lightbox master target — Workers assets must stay ≤25 MiB. */
  minHeroWidth: 1920,
  minWidth: 1280,
  /** Hard ceiling aligned with Cloudflare Workers static asset limit. */
  maxBytes: 25 * 1024 * 1024,
} as const;

export const ASSET_BUDGETS = {
  maxImageBytes: 600 * 1024,
  maxAnyBytes: 2 * 1024 * 1024,
  rasterExt: new Set(['.jpg', '.jpeg', '.png']),
} as const;

export const BUNDLE_BUDGETS = {
  maxChunkBytes: budgets.bundle.maxChunkKb * 1024,
  maxTotalStaticJsBytes: budgets.bundle.maxTotalStaticJsMb * 1024 * 1024,
} as const;

export const LIGHTHOUSE_BUDGETS = {
  minPerformance: Math.round(budgets.lighthouse.performance * 100),
  minAccessibility: Math.round(budgets.lighthouse.accessibility * 100),
  minBestPractices: Math.round(budgets.lighthouse.bestPractices * 100),
  minSeo: Math.round(budgets.lighthouse.seo * 100),
} as const;

export const CWV_BUDGETS = budgets.cwv;
