import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens');

const tierSchema = z.enum(['featured', 'more']);

export const caseStudyEditorSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, 'Title is required').max(200),
  h1: z.string().trim().min(1, 'H1 is required').max(200),
  tier: tierSchema,
  category: z.string().trim().min(1, 'Category is required').max(120),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  overview: z.string().trim().max(10000),
  scopeItemsText: z.string().trim(),
  seoTitle: z.string().trim().min(1, 'SEO title is required').max(200),
  seoDescription: z.string().trim().min(1, 'SEO description is required').max(500),
  seoImage: z.string().trim(),
  client: z.string().trim().max(200),
  industry: z.string().trim().max(200),
  year: z.string().trim().max(20),
  heroImage: z.string().trim(),
  deliverablesText: z.string().trim(),
  challenge: z.string().trim().max(10000),
  approach: z.string().trim().max(10000),
  outcome: z.string().trim().max(10000),
  quoteText: z.string().trim().max(2000),
  quoteAuthor: z.string().trim().max(200),
  accentColor: z.string().trim().max(20),
  accentOnColor: z.string().trim().max(20),
  prevSlug: z.string().trim().max(120),
  nextSlug: z.string().trim().max(120),
  galleryJson: z.string().trim(),
  resultsJson: z.string().trim(),
});

export type CaseStudyEditorInput = z.infer<typeof caseStudyEditorSchema>;

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

export function buildCaseStudyPayload(input: CaseStudyEditorInput) {
  const scope_items = linesToList(input.scopeItemsText);
  const deliverables = linesToList(input.deliverablesText);

  const seo = {
    title: input.seoTitle,
    description: input.seoDescription,
    ...(input.seoImage ? { image: input.seoImage } : {}),
  };

  const quote =
    input.quoteText && input.quoteAuthor
      ? { text: input.quoteText, author: input.quoteAuthor }
      : null;

  const accent = input.accentColor
    ? { color: input.accentColor, ...(input.accentOnColor ? { onColor: input.accentOnColor } : {}) }
    : null;

  return {
    slug: input.slug,
    title: input.title,
    h1: input.h1,
    tier: input.tier,
    category: input.category,
    sort_order: input.sortOrder,
    overview: input.overview,
    scope_items,
    gallery: parseOptionalJson(input.galleryJson, 'Gallery') ?? [],
    seo,
    client: input.client || null,
    industry: input.industry || null,
    year: input.year || null,
    hero_image: input.heroImage || null,
    deliverables: deliverables.length > 0 ? deliverables : null,
    results: parseOptionalJson(input.resultsJson, 'Results'),
    challenge: input.challenge || null,
    approach: input.approach || null,
    outcome: input.outcome || null,
    quote,
    accent,
    prev_slug: input.prevSlug || null,
    next_slug: input.nextSlug || null,
  };
}

export function emptyCaseStudyEditorValues(): CaseStudyEditorInput {
  return {
    slug: '',
    title: '',
    h1: '',
    tier: 'featured',
    category: '',
    sortOrder: 0,
    overview: '',
    scopeItemsText: '',
    seoTitle: '',
    seoDescription: '',
    seoImage: '',
    client: '',
    industry: '',
    year: '',
    heroImage: '',
    deliverablesText: '',
    challenge: '',
    approach: '',
    outcome: '',
    quoteText: '',
    quoteAuthor: '',
    accentColor: '',
    accentOnColor: '',
    prevSlug: '',
    nextSlug: '',
    galleryJson: '[]',
    resultsJson: '',
  };
}
