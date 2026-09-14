import { getCloudflareContext } from '@opennextjs/cloudflare';
// Imported as a scoped module type, not added to tsconfig's global `types` —
// @cloudflare/workers-types' ambient globals would collide with this project's
// DOM lib types (Request/Response/etc.) across the whole codebase.
import type { D1Database } from '@cloudflare/workers-types';

/**
 * The D1 binding, as declared in wrangler.jsonc (`"binding": "DB"`).
 *
 * D1 is only reachable as a Workers binding — unlike Supabase (a plain HTTP API),
 * it has no meaningful data outside a real request context. `next build` runs on
 * build infra, not inside a deployed Worker, so `getCloudflareContext()` there
 * reads local/dev-simulated values, not the real remote database. Content routes
 * back on this are rendered dynamically (see the `dynamic`/`revalidate` exports on
 * their page files) precisely so this always runs at genuine request time on the
 * edge, where the binding is real.
 */
export function getDb(): D1Database | null {
  try {
    const { env } = getCloudflareContext();
    return (env as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

/** True when a real D1 binding is reachable right now (i.e. we're inside a genuine Workers request). */
export function hasD1(): boolean {
  return getDb() !== null;
}
