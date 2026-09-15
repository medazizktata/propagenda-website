import type { CaseStudyRow } from '@/types/cms';
import type { CaseStudyQuote, CaseStudyAccent, SeoMeta } from '@/types/content';
import {
  emptyCaseStudyEditorValues,
  type CaseStudyEditorInput,
} from '@/lib/cms/case-studies/schema';

function listToLines(values: string[] | null | undefined): string {
  return (values ?? []).join('\n');
}

function jsonToString(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value) && value.length === 0) return '';
  return JSON.stringify(value, null, 2);
}

export function caseStudyRowToEditorValues(row: CaseStudyRow): CaseStudyEditorInput {
  const seo = row.seo as unknown as SeoMeta | null;
  const quote = row.quote as unknown as CaseStudyQuote | null;
  const accent = row.accent as unknown as CaseStudyAccent | null;
  const scopeItems = (row.scope_items ?? []) as unknown as string[];
  const deliverables = row.deliverables as unknown as string[] | null;

  return {
    slug: row.slug,
    title: row.title,
    h1: row.h1,
    tier: (row.tier as CaseStudyEditorInput['tier']) ?? 'featured',
    category: row.category,
    sortOrder: row.sort_order,
    overview: row.overview,
    scopeItemsText: listToLines(scopeItems),
    seoTitle: seo?.title ?? row.title,
    seoDescription: seo?.description ?? '',
    seoImage: seo?.image ?? '',
    client: row.client ?? '',
    industry: row.industry ?? '',
    year: row.year ?? '',
    heroImage: row.hero_image ?? '',
    deliverablesText: listToLines(deliverables),
    challenge: row.challenge ?? '',
    approach: row.approach ?? '',
    outcome: row.outcome ?? '',
    quoteText: quote?.text ?? '',
    quoteAuthor: quote?.author ?? '',
    accentColor: accent?.color ?? '',
    accentOnColor: accent?.onColor ?? '',
    prevSlug: row.prev_slug ?? '',
    nextSlug: row.next_slug ?? '',
    galleryJson: jsonToString(row.gallery) || '[]',
    resultsJson: jsonToString(row.results),
  };
}

export { emptyCaseStudyEditorValues };
