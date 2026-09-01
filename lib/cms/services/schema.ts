import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens');

const hubTagSchema = z.enum(['brand', 'digital', 'production', 'experience']);

export const serviceEditorSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, 'Title is required').max(200),
  h1: z.string().trim().min(1, 'H1 is required').max(200),
  overview: z.string().trim().max(10000),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  scopeItemsText: z.string().trim(),
  seoTitle: z.string().trim().min(1, 'SEO title is required').max(200),
  seoDescription: z.string().trim().min(1, 'SEO description is required').max(500),
  seoImage: z.string().trim(),
  hubImage: z.string().trim().min(1, 'Hub image path is required'),
  hubTag: hubTagSchema,
  hubDescriptor: z.string().trim().min(1, 'Hub descriptor is required').max(200),
  hubPreview: z.string().trim(),
  hubSubBulletsText: z.string().trim(),
  galleryJson: z.string().trim(),
  tiersJson: z.string().trim(),
  eventChecklistText: z.string().trim(),
  extendedBulletsText: z.string().trim(),
  relatedWorkJson: z.string().trim(),
  tertiaryCtaJson: z.string().trim(),
});

export type ServiceEditorInput = z.infer<typeof serviceEditorSchema>;

export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseOptionalJson<T>(raw: string, label: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
}

export function buildServicePayload(input: ServiceEditorInput) {
  const scope_items = linesToList(input.scopeItemsText);
  const event_checklist = linesToList(input.eventChecklistText);
  const extended_bullets = linesToList(input.extendedBulletsText);
  const subBullets = linesToList(input.hubSubBulletsText);

  const hub = {
    image: input.hubImage,
    tag: input.hubTag,
    descriptor: input.hubDescriptor,
    ...(input.hubPreview ? { preview: input.hubPreview } : {}),
    ...(subBullets.length > 0 ? { subBullets } : {}),
  };

  const seo = {
    title: input.seoTitle,
    description: input.seoDescription,
    ...(input.seoImage ? { image: input.seoImage } : {}),
  };

  return {
    slug: input.slug,
    title: input.title,
    h1: input.h1,
    overview: input.overview,
    sort_order: input.sortOrder,
    scope_items,
    gallery: parseOptionalJson(input.galleryJson, 'Gallery') ?? [],
    seo,
    tiers: parseOptionalJson(input.tiersJson, 'Tiers'),
    event_checklist: event_checklist.length > 0 ? event_checklist : null,
    extended_bullets: extended_bullets.length > 0 ? extended_bullets : null,
    related_work: parseOptionalJson(input.relatedWorkJson, 'Related work'),
    tertiary_cta: parseOptionalJson(input.tertiaryCtaJson, 'Tertiary CTA'),
    hub,
  };
}

export function emptyServiceEditorValues(): ServiceEditorInput {
  return {
    slug: '',
    title: '',
    h1: '',
    overview: '',
    sortOrder: 0,
    scopeItemsText: '',
    seoTitle: '',
    seoDescription: '',
    seoImage: '',
    hubImage: '',
    hubTag: 'brand',
    hubDescriptor: '',
    hubPreview: '',
    hubSubBulletsText: '',
    galleryJson: '[]',
    tiersJson: '',
    eventChecklistText: '',
    extendedBulletsText: '',
    relatedWorkJson: '',
    tertiaryCtaJson: '',
  };
}
