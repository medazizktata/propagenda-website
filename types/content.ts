export const SERVICE_SLUGS = [
  'branding-visual-identity',
  'public-relations',
  'online-offline-marketing',
  'websites',
  'mobile-applications',
  'events',
  'photography-videography',
] as const;

export const WORK_SLUGS = [
  'sanapex-interiors',
  'p2p-motors',
  'dose-pharmacy',
  'clemson-porter-properties',
  'emirates-agro',
  'zealerz',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type WorkSlug = (typeof WORK_SLUGS)[number];

export interface SeoMeta {
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BrandingTier {
  name: string;
  items: string[];
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface ServiceCta {
  label: string;
  href: string;
}

export interface ServiceRecord {
  slug: ServiceSlug;
  title: string;
  h1: string;
  overview: string;
  scopeItems: string[];
  gallery: GalleryImage[];
  seo: SeoMeta;
  tiers?: BrandingTier[];
  eventChecklist?: string[];
  extendedBullets?: string[];
  relatedWork?: RelatedLink[];
  tertiaryCta?: ServiceCta;
}

export type WorkTier = 'featured' | 'more';

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudyQuote {
  text: string;
  author: string;
}

/**
 * Per-client body accent. Drives the case-study body tint (section marks, result
 * numbers, deliverable checks, pull-quote) so each study can feel tailored to its
 * real brand palette. Absent ⇒ the detail template falls back to brand orange.
 * Data-driven so more clients can adopt their own accent later.
 */
export interface CaseStudyAccent {
  /** Accent color as a hex string, e.g. Sanapex sand `#baa58d`. */
  color: string;
  /** Foreground for text/marks sitting ON the accent fill. Defaults to navy. */
  onColor?: string;
}

export interface CaseStudyRecord {
  slug: WorkSlug;
  title: string;
  h1: string;
  /** Legacy featured/more tier — retained in the data but no longer used for hub grouping. */
  tier: WorkTier;
  /** Broad industry category used to group the Work hub (sentence case, e.g. "Automotive"). */
  category: string;
  overview: string;
  scopeItems: string[];
  gallery: GalleryImage[];
  prev?: WorkSlug;
  next?: WorkSlug;
  seo: SeoMeta;
  client?: string;
  industry?: string;
  year?: string;
  heroImage?: string;
  deliverables?: string[];
  results?: CaseStudyResult[];
  challenge?: string;
  approach?: string;
  outcome?: string;
  quote?: CaseStudyQuote;
  /** Optional per-client body accent (falls back to brand orange). */
  accent?: CaseStudyAccent;
}

export interface LegalSection {
  heading?: string;
  paragraphs: string[];
}

export interface LegalRecord {
  slug: 'privacy' | 'terms' | 'imprint';
  title: string;
  h1: string;
  sections: LegalSection[];
  centered?: boolean;
  seo: SeoMeta;
}

export type VideoOrientation = 'landscape' | 'portrait';

/** A single video in the /work/video showcase. `src` empty = a poster-only swap-in slot. */
export interface VideoProject {
  slug: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  orientation: VideoOrientation;
  width: number;
  height: number;
  duration?: string;
  client?: string;
  description?: string;
  placeholder?: boolean;
}
