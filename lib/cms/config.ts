import { isSupabaseConfigured } from '@/lib/supabase/env';

/** Published CMS content is read from Supabase when configured. */
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

export function assertDatabaseContentReady(): void {
  if (!usesDatabaseContent()) {
    throw new Error(
      'Database content is required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run migrations, then pnpm seed:cms.',
    );
  }
}
