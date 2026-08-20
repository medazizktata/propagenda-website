/**
 * Env feature flags (NEXT_PUBLIC_*). Set in `.env` / Cloudflare Workers Builds env.
 *
 * Soft launch (default ON):
 *   NEXT_PUBLIC_FF_SOFT_LAUNCH=true
 * Unlock one route family while soft launch stays on:
 *   NEXT_PUBLIC_FF_PAGE_ABOUT=true
 *   NEXT_PUBLIC_FF_PAGE_SERVICES=true
 *   NEXT_PUBLIC_FF_PAGE_CONTACT=true
 *   NEXT_PUBLIC_FF_PAGE_LEGAL=true   (privacy / terms / imprint)
 * Work is special: /work + /work/* stay locked unless explicitly unlocked
 * (even when soft launch is off):
 *   NEXT_PUBLIC_FF_PAGE_WORK=true
 * Kill soft launch for non-work pages (all other pages public):
 *   NEXT_PUBLIC_FF_SOFT_LAUNCH=false
 * Clean Cuberto-style page transition instead of the ornate orange curtain:
 *   NEXT_PUBLIC_FF_COMPLEX_CURTAIN=false
 *
 * Legacy aliases still work: NEXT_PUBLIC_SOFT_LAUNCH, NEXT_PUBLIC_INIT_LOADER.
 *
 * IMPORTANT: values must be read via static `process.env.NEXT_PUBLIC_*` access so Next
 * inlines them into the client bundle. Dynamic `process.env[name]` stays undefined in the browser.
 */

function parseFlag(raw: string | undefined, fallback: boolean): boolean {
  if (raw == null || raw === '') return fallback;
  const v = raw.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'off'].includes(v)) return false;
  return fallback;
}

/**
 * Soft launch master — lock unfinished routes behind coming-soon. Default: on.
 * Equality checks (not parseFlag) so Next reliably inlines into the client bundle.
 */
export const ffSoftLaunch =
  process.env.NEXT_PUBLIC_FF_SOFT_LAUNCH === 'false' ||
  process.env.NEXT_PUBLIC_SOFT_LAUNCH === 'false'
    ? false
    : process.env.NEXT_PUBLIC_FF_SOFT_LAUNCH === 'true' ||
        process.env.NEXT_PUBLIC_SOFT_LAUNCH === 'true'
      ? true
      : true;

/** Orange quote splash on full page load. Default: on. */
export const ffInitLoader = parseFlag(
  process.env.NEXT_PUBLIC_FF_INIT_LOADER ?? process.env.NEXT_PUBLIC_INIT_LOADER,
  true,
);

/**
 * Page-transition style. Default (on): the ornate per-route orange curtain — quote + logo +
 * nine cover variants. Set NEXT_PUBLIC_FF_COMPLEX_CURTAIN=false for the clean Cuberto-style
 * transition: a single solid panel that wipes up over the page and retracts off the top.
 */
export const ffComplexCurtain = parseFlag(process.env.NEXT_PUBLIC_FF_COMPLEX_CURTAIN, true);

/** Per-route unlocks while soft launch is active. Default: locked (false). */
export const pageFlags = {
  home: true, // always public
  about: parseFlag(process.env.NEXT_PUBLIC_FF_PAGE_ABOUT, false),
  services: parseFlag(process.env.NEXT_PUBLIC_FF_PAGE_SERVICES, false),
  work: parseFlag(process.env.NEXT_PUBLIC_FF_PAGE_WORK, false),
  contact: parseFlag(process.env.NEXT_PUBLIC_FF_PAGE_CONTACT, false),
  legal: parseFlag(process.env.NEXT_PUBLIC_FF_PAGE_LEGAL, false),
} as const;

export type PageFlagKey = keyof typeof pageFlags;

/** Map pathname → page flag key (null = always allow / not a gated page). */
export function pageFlagForPath(pathname: string): PageFlagKey | null {
  const path = pathname.split('?')[0]?.split('#')[0] || '/';
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  if (normalized === '/') return 'home';
  if (normalized === '/about') return 'about';
  if (normalized === '/services' || normalized.startsWith('/services/')) return 'services';
  if (normalized === '/work' || normalized.startsWith('/work/')) return 'work';
  if (normalized === '/contact') return 'contact';
  if (normalized === '/privacy' || normalized === '/terms' || normalized === '/imprint') {
    return 'legal';
  }
  return null;
}

/** Infra / static prefixes never gated. */
const ALWAYS_OPEN_PREFIXES = [
  '/api/',
  '/_next/',
  '/images/',
  '/videos/',
  '/fonts/',
] as const;

const ALWAYS_OPEN_EXACT = ['/api/contact'] as const;

export function isFeatureUnlocked(pathname: string): boolean {
  const path = pathname.split('?')[0]?.split('#')[0] || '/';
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  if ((ALWAYS_OPEN_EXACT as readonly string[]).includes(normalized)) return true;
  if (ALWAYS_OPEN_PREFIXES.some((p) => normalized.startsWith(p))) return true;

  const key = pageFlagForPath(normalized);

  // Work (+ /work/*) stays locked unless explicitly unlocked — even if soft launch is off.
  if (key === 'work') return pageFlags.work;

  if (!ffSoftLaunch) return true;

  if (key == null) return false; // unknown gated routes stay locked while soft launch is on
  return pageFlags[key];
}
