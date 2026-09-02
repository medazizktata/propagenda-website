import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Published CMS content is read from Supabase when URL + anon key are set.
 * Without them (e.g. CF Builds missing env), public loaders fall back to
 * `content/*` seed modules so SSG still succeeds.
 */
export function usesDatabaseContent(): boolean {
  return isSupabaseConfigured();
}

/** @deprecated Use usesDatabaseContent */
export function isCmsEnabled(): boolean {
  return usesDatabaseContent();
}

export function getDefaultLocale(): string {
  return 'en';
}

/** Admin / seed scripts that must talk to Supabase — not used by public SSG. */
export function assertDatabaseContentReady(): void {
  if (!usesDatabaseContent()) {
    throw new Error(
      'Database content is required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run migrations, then pnpm seed:cms.',
    );
  }
}
