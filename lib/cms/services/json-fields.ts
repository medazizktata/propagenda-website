import type {
  BrandingTier,
  GalleryImage,
  RelatedLink,
  ServiceCta,
} from '@/types/content';

function safeParse<T>(raw: string, fallback: T): T {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function jsonParseError(raw: string): string | null {
  if (!raw.trim()) return null;
  try {
    JSON.parse(raw);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid JSON';
  }
}

export function prettyJsonString(raw: string, emptyFallback = ''): string {
  if (!raw.trim()) return emptyFallback;
  try {
    return `${JSON.stringify(JSON.parse(raw), null, 2)}\n`;
  } catch {
    return raw;
  }
}

export function parseGalleryField(raw: string): GalleryImage[] {
  const parsed = safeParse(raw, [] as GalleryImage[]);
  return Array.isArray(parsed) ? parsed : [];
}

export function serializeGalleryField(items: GalleryImage[]): string {
  const cleaned = items.filter((item) => item.src.trim() || item.alt.trim());
  return cleaned.length > 0 ? JSON.stringify(cleaned) : '[]';
}

export function parseTiersField(raw: string): BrandingTier[] {
  const parsed = safeParse(raw, null as BrandingTier[] | null);
  return Array.isArray(parsed) ? parsed : [];
}

export function serializeTiersField(items: BrandingTier[]): string {
  const cleaned = items
    .map((tier) => ({
      name: tier.name.trim(),
      items: tier.items.map((item) => item.trim()).filter(Boolean),
    }))
    .filter((tier) => tier.name || tier.items.length > 0);
  return cleaned.length > 0 ? JSON.stringify(cleaned) : '';
}

export function parseRelatedWorkField(raw: string): RelatedLink[] {
  const parsed = safeParse(raw, null as RelatedLink[] | null);
  return Array.isArray(parsed) ? parsed : [];
}

export function serializeRelatedWorkField(items: RelatedLink[]): string {
  const cleaned = items.filter((item) => item.label.trim() && item.href.trim());
  return cleaned.length > 0 ? JSON.stringify(cleaned) : '';
}

export function parseTertiaryCtaField(raw: string): ServiceCta | null {
  const parsed = safeParse(raw, null as ServiceCta | null);
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.label?.trim() || !parsed.href?.trim()) return null;
  return { label: parsed.label.trim(), href: parsed.href.trim() };
}

export function serializeTertiaryCtaField(cta: ServiceCta | null): string {
  if (!cta?.label.trim() || !cta.href.trim()) return '';
  return JSON.stringify({ label: cta.label.trim(), href: cta.href.trim() });
}

export function emptyGalleryImage(): GalleryImage {
  return { src: '', alt: '', width: 1600, height: 1200 };
}

export function emptyBrandingTier(): BrandingTier {
  return { name: '', items: [''] };
}

export function emptyRelatedLink(): RelatedLink {
  return { label: '', href: '' };
}
