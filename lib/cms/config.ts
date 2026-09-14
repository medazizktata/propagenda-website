import { hasD1 } from '@/lib/d1/client';

/**
 * Published CMS content is read from D1 when a real binding is reachable (i.e.
 * we're inside a genuine Workers request, not a `next build` step running on
 * build infra). Without it, public loaders fall back to `content/*` seed
 * modules so a build without Cloudflare context still succeeds.
 *
 * Content used to live in Supabase; TASK-11 migrated data to D1. Supabase Auth
 * still gates /admin until TASK-11.4 lands Cloudflare Access.
 */
export function usesDatabaseContent(): boolean {
  return hasD1();
}

/** @deprecated Use usesDatabaseContent */
export function isCmsEnabled(): boolean {
  return usesDatabaseContent();
}

export function getDefaultLocale(): string {
  return 'en';
}

/** Admin / seed scripts that must talk to D1 — not used by public SSG. */
export function assertDatabaseContentReady(): void {
  if (!usesDatabaseContent()) {
    throw new Error(
      'Database content is required. Run this inside a Cloudflare Workers request context (a deployed Worker, or `next dev` with a bound D1 database), and ensure d1/migrations have been applied.',
    );
  }
}
