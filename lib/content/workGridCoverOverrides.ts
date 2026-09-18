import type { WorkSlug } from '@/types/content';

/**
 * The grid needs a cover that reads as "what kind of business is this" in ~2 seconds — the
 * case study's `heroImage` was picked for the detail-page hero instead (brand storytelling,
 * not business legibility), so a handful of studies show a flat-lay of collateral/logo/type
 * specimens there instead of the client's actual product or environment.
 *
 * This is a grid-only override: it never touches `heroImage` (still the detail-page hero) and
 * never reorders any study's `gallery` array (the detail page reads `gallery[1]` and
 * `gallery.slice(2)` by fixed index). Values are indexes into that study's own `gallery`
 * array (already resolved through resolveMediaUrl by the time it reaches WorkCard — an
 * index, not a copied `src` string, so this stays correct whether the src is a local seed
 * path or a D1/R2 key) — picked by comparing every image's alt text for which one most
 * clearly shows the client's actual product, environment or people-at-work, rather than
 * branding collateral, a logo mark, a color/type specimen, or a generic mockup. See
 * `content/work/index.ts` for the full gallery arrays and alt text this was judged from.
 *
 * Only studies where the pick actually changes are listed here.
 */
export const workGridCoverOverrides: Partial<Record<WorkSlug, number>> = {
  // Hero is a stationery/collateral flat-lay; gallery[1] is the social campaign showing actual
  // interior-design project photography.
  'sanapex-interiors': 1,
  // Hero is a stationery/flag/signage collage; gallery[2] shows the gold-and-black livery on an
  // actual sports car — instantly reads "automotive" (the flagged example).
  'p2p-motors': 2,
  // Hero is a flat logo/wordmark cover; gallery[1] is the billboard with a pharmacist holding
  // medication — reads "pharmacy" immediately.
  'dose-pharmacy': 1,
  // Hero is a business-card mockup; gallery[3] is the before/after interior-design social
  // carousel — shows the actual design work.
  'bnk-group': 3,
  // Hero is a business-card mockup; gallery[2] shows the catalog open to real interior renders
  // of a reception/lounge space.
  vid: 2,
  // Hero is a logo embossed on paper (branding-guidelines cover); gallery[6] is an embossed
  // coffee cup and saucer set on a table — reads "cafe" immediately.
  'alateeq-cafe': 6,
  // Hero is a company-profile-cover mockup; gallery[1] has an actual 3D building render —
  // reads "real estate".
  'dhc-luxury-real-estate': 1,
  // Hero is a metallic logo mark on a gradient background; gallery[1] shows two real sports
  // cars in a showroom — reads "car dealership" immediately.
  'sterling-cars': 1,
  // Hero is branded flags against the sky (ambiguous); gallery[4] is the festival fence banner
  // set against an actual festival stage — reads "event production".
  'mm-event-management': 4,
};
