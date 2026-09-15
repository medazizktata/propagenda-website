/**
 * Case-study media used to be exclusively local files (`/images/work/<slug>/...`,
 * served straight out of `public/`). TASK-11.5 moves it to R2, but the seed-file
 * fallback (`content/work/*.ts`, used when D1 isn't reachable) still points at
 * those same local paths and must keep working unchanged.
 *
 * Public bucket, not signed URLs: this is marketing content already public in
 * the deployed site (and in the git repo before this migration) -- nothing here
 * needs gating, and signed URLs would only add latency/complexity for no benefit.
 * Decision recorded here per TASK-11.5's acceptance criteria, not defaulted
 * silently.
 *
 * Convention: a value starting with "/" is already a resolvable path (local
 * /public asset, from the seed fallback) and is returned as-is. Anything else is
 * treated as a relative R2 object key (e.g. "case-study-media/sealand/hero.webp",
 * per the target architecture doc's section 6 -- never a complete URL, so the
 * media domain can change without rewriting every row) and gets the public R2
 * domain prepended.
 */
const R2_PUBLIC_BASE = 'https://pub-407269a8f50248bbbcef3c6a229fda51.r2.dev';

export function resolveMediaUrl(value: string): string {
  if (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return `${R2_PUBLIC_BASE}/${value}`;
}
