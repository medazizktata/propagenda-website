/**
 * Loader splash presets — edit text + animation in one place.
 *
 * DX:
 * 1. `loaderTextMotion.speed` / `.sizeScale` — quote speed & size
 * 2. `loaderCurtainMotion.mode` — `'route'` (per-page) or `'random'`
 * 3. `loaderPresets[id]` — lines + attribution + entrance + curtain
 * 4. `routeLoaderPresets` — path → preset id
 * 5. `initLoaderPresetIds` — first-load quote pool
 */

/** Global knobs for quote copy on init + page transitions. */
export const loaderTextMotion = {
  /**
   * Timeline timeScale. 1 = baseline, higher = faster.
   * Fast overall: ~1.75–2.0
   */
  speed: 1.85,
  /**
   * Multiplies quote font-size clamps. 1 = original · ~0.78–0.85 = tighter.
   */
  sizeScale: 0.78,
} as const;

/**
 * How the full-screen orange div enters.
 * - `route`  → use each preset’s `curtain`
 * - `random` → pick from `loaderCurtainPool` every navigation
 */
export const loaderCurtainMotion = {
  mode: 'route' as 'route' | 'random',
} as const;

export type LoaderEntrance =
  | 'rise'
  | 'meet'
  | 'horizon'
  | 'assemble'
  | 'expose'
  | 'pulse'
  | 'invite'
  | 'clarify';

/** Full-screen orange shell cover animation. */
export type LoaderCurtain =
  /** Classic bottom wipe up. */
  | 'wipe-up'
  /** Drop from the top. */
  | 'wipe-down'
  /** Horizontal push from the left. */
  | 'wipe-left'
  /** Horizontal push from the right. */
  | 'wipe-right'
  /** Center iris expand. */
  | 'iris'
  /** Diagonal slash uncover. */
  | 'slash'
  /** Scale burst from center. */
  | 'burst'
  /** Perspective fold down from top. */
  | 'fold'
  /** Venetian blinds (strips). */
  | 'blinds';

export type InitLoaderQuote = {
  lines: string[];
  attribution: string;
  entrance: LoaderEntrance;
  /** Orange shell cover — used when `loaderCurtainMotion.mode === 'route'`. */
  curtain: LoaderCurtain;
};

/** Pool used when mode is `random` (and for init splash). */
export const loaderCurtainPool: LoaderCurtain[] = [
  'wipe-up',
  'wipe-down',
  'wipe-left',
  'wipe-right',
  'iris',
  'slash',
  'burst',
  'fold',
  'blinds',
];

export const loaderPresets = {
  // ── Semantic page presets ──────────────────────────────────
  home: {
    lines: ['WHERE', 'CREATIVITY', 'MEETS', 'STRATEGY.'],
    attribution: 'HOME',
    entrance: 'meet',
    curtain: 'iris',
  },
  about: {
    lines: ['LOOKING', 'FOR THE', 'BETTER', 'FUTURE.'],
    attribution: 'ABOUT',
    entrance: 'horizon',
    curtain: 'wipe-up',
  },
  services: {
    lines: ['IDEAS', 'THAT', 'SHOW', 'UP.'],
    attribution: 'SERVICES',
    entrance: 'assemble',
    curtain: 'blinds',
  },
  work: {
    lines: ['PROOF', 'IN THE', 'WORK.'],
    attribution: 'WORK',
    entrance: 'expose',
    curtain: 'wipe-left',
  },
  blog: {
    lines: ['THINK', 'LOUDER.', 'BUILD', 'BETTER.'],
    attribution: 'BLOG',
    entrance: 'pulse',
    curtain: 'slash',
  },
  contact: {
    lines: ["LET'S", 'START A', 'CONVERSATION.'],
    attribution: 'CONTACT',
    entrance: 'invite',
    curtain: 'fold',
  },
  privacy: {
    lines: ['CLEAR', 'RULES.', 'CLEAR', 'TRUST.'],
    attribution: 'PRIVACY',
    entrance: 'clarify',
    curtain: 'wipe-down',
  },
  terms: {
    lines: ['THE FINE', 'PRINT,', 'SPELLED', 'OUT.'],
    attribution: 'TERMS',
    entrance: 'clarify',
    curtain: 'burst',
  },
  imprint: {
    lines: ['WHO', 'WE ARE.', 'WHERE', 'WE STAND.'],
    attribution: 'IMPRINT',
    entrance: 'clarify',
    curtain: 'wipe-right',
  },

  // ── Init-only variants (first-load pool) ───────────────────
  looking: {
    lines: ['LOOKING', 'FOR THE', 'BETTER', 'FUTURE.'],
    attribution: 'PROPAGENDA',
    entrance: 'rise',
    curtain: 'wipe-up',
  },
  together: {
    lines: ['TOGETHER', 'FOR THE', 'BETTER', 'FUTURE.'],
    attribution: 'PROPAGENDA',
    entrance: 'rise',
    curtain: 'iris',
  },
  meetBrand: {
    lines: ['WHERE', 'CREATIVITY', 'MEETS', 'STRATEGY.'],
    attribution: 'PROPAGENDA',
    entrance: 'meet',
    curtain: 'burst',
  },
  godin: {
    lines: ["IF YOU DON'T", 'GIVE THE MARKET', 'THE STORY', 'TO TALK ABOUT.'],
    attribution: 'SETH GODIN:',
    entrance: 'rise',
    curtain: 'slash',
  },
  story: {
    lines: ["YOUR BRAND'S", 'STORY', "ISN'T", 'OPTIONAL.'],
    attribution: 'PROPAGENDA',
    entrance: 'pulse',
    curtain: 'fold',
  },
  start: {
    lines: ['START', 'WITH THE', 'BETTER', 'IDEA.'],
    attribution: 'PROPAGENDA',
    entrance: 'assemble',
    curtain: 'blinds',
  },
} as const satisfies Record<string, InitLoaderQuote>;

export type LoaderPresetId = keyof typeof loaderPresets;

/** Destination path → preset id. Swap ids to change a page’s splash. */
export const routeLoaderPresets: Record<string, LoaderPresetId> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/work': 'work',
  '/blog': 'blog',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/imprint': 'imprint',
};

/** First-load rotation — ids into `loaderPresets`. */
export const initLoaderPresetIds: LoaderPresetId[] = [
  'looking',
  'together',
  'meetBrand',
  'godin',
  'story',
  'start',
];

const FALLBACK: LoaderPresetId = 'looking';

export function presetQuote(id: LoaderPresetId): InitLoaderQuote {
  return loaderPresets[id];
}

export function pickCurtain(seed = Math.random()): LoaderCurtain {
  const i = Math.floor(seed * loaderCurtainPool.length) % loaderCurtainPool.length;
  return loaderCurtainPool[i] ?? 'wipe-up';
}

export function pickInitLoaderQuote(seed = Math.random()): InitLoaderQuote {
  const i = Math.floor(seed * initLoaderPresetIds.length) % initLoaderPresetIds.length;
  const base = presetQuote(initLoaderPresetIds[i] ?? FALLBACK);
  // Init always randomizes the shell so hard-reload feels fresh.
  return { ...base, curtain: pickCurtain(seed * 7.13) };
}

function pathKey(pathname: string): string {
  return (pathname.split('?')[0] || '/').replace(/\/$/, '') || '/';
}

function presetIdForPath(pathname: string): LoaderPresetId {
  const path = pathKey(pathname);
  if (routeLoaderPresets[path]) return routeLoaderPresets[path]!;
  if (path.startsWith('/services')) return routeLoaderPresets['/services'] ?? 'services';
  if (path.startsWith('/work')) return routeLoaderPresets['/work'] ?? 'work';
  if (path.startsWith('/blog')) return routeLoaderPresets['/blog'] ?? 'blog';
  return FALLBACK;
}

/** Resolve transition quote for a destination path (pathname only). */
export function quoteForPath(pathname: string): InitLoaderQuote {
  return presetQuote(presetIdForPath(pathname));
}

/** Resolve orange-shell cover for a destination (respects `loaderCurtainMotion.mode`). */
export function curtainForPath(pathname: string, seed = Math.random()): LoaderCurtain {
  if (loaderCurtainMotion.mode === 'random') return pickCurtain(seed);
  return presetQuote(presetIdForPath(pathname)).curtain;
}

/** Tailwind cover class for a curtain id. */
export function curtainCoverClass(curtain: LoaderCurtain): string {
  return `animate-loader-cover-${curtain}`;
}

/** @deprecated Use `initLoaderPresetIds` + `loaderPresets`. */
export const initLoaderQuotes: InitLoaderQuote[] = initLoaderPresetIds.map(presetQuote);
