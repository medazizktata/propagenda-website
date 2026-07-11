export const SERVICE_SLUGS = [
  'branding-visual-identity',
  'public-relations',
  'online-offline-marketing',
  'graphics-production',
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

export const BLOG_SLUGS = [
  'the-power-of-visual-identity',
  'whats-destroying-your-brand',
  'how-colors-influence-consumer-behavior',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type WorkSlug = (typeof WORK_SLUGS)[number];
export type BlogSlug = (typeof BLOG_SLUGS)[number];

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

export interface CaseStudyRecord {
  slug: WorkSlug;
  title: string;
  h1: string;
  tier: WorkTier;
  overview: string;
  scopeItems: string[];
  gallery: GalleryImage[];
  prev?: WorkSlug;
  next?: WorkSlug;
  seo: SeoMeta;
}

export interface BlogPostRecord {
  slug: BlogSlug;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
  image?: GalleryImage;
  tags: string[];
  seo: SeoMeta;
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
