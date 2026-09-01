import type { ServiceHubCard } from '@/content/servicesHub';
import type { ServiceEditorInput } from '@/lib/cms/services/schema';
import {
  parseGalleryField,
  parseRelatedWorkField,
  parseTertiaryCtaField,
  parseTiersField,
} from '@/lib/cms/services/json-fields';
import { linesToList } from '@/lib/cms/services/schema';
import type { ServiceRecord, ServiceSlug } from '@/types/content';

export function editorInputToServiceRecord(input: ServiceEditorInput): ServiceRecord | null {
  const slug = input.slug.trim();
  const title = input.title.trim();
  const h1 = input.h1.trim() || title;

  if (!slug || !title) return null;

  const scopeItems = linesToList(input.scopeItemsText);
  const eventChecklist = linesToList(input.eventChecklistText);
  const extendedBullets = linesToList(input.extendedBulletsText);
  const gallery = parseGalleryField(input.galleryJson);
  const tiers = parseTiersField(input.tiersJson);
  const tiersOrNull = tiers.length > 0 ? tiers : null;
  const relatedWorkParsed = parseRelatedWorkField(input.relatedWorkJson);
  const relatedWork = relatedWorkParsed.length > 0 ? relatedWorkParsed : null;
  const tertiaryCta = parseTertiaryCtaField(input.tertiaryCtaJson);

  const seoTitle = input.seoTitle.trim() || title;
  const seoDescription = input.seoDescription.trim() || input.overview.trim();

  return {
    slug: slug as ServiceSlug,
    title,
    h1,
    overview: input.overview,
    scopeItems,
    gallery,
    seo: {
      title: seoTitle,
      description: seoDescription,
      ...(input.seoImage.trim() ? { image: input.seoImage.trim() } : {}),
    },
    ...(tiersOrNull ? { tiers: tiersOrNull } : {}),
    ...(eventChecklist.length > 0 ? { eventChecklist } : {}),
    ...(extendedBullets.length > 0 ? { extendedBullets } : {}),
    ...(relatedWork ? { relatedWork } : {}),
    ...(tertiaryCta ? { tertiaryCta } : {}),
  };
}

export function editorInputToHubCard(input: ServiceEditorInput): ServiceHubCard | null {
  const slug = input.slug.trim();
  const title = input.title.trim();

  if (!slug || !title || !input.hubImage.trim() || !input.hubDescriptor.trim()) {
    return null;
  }

  const subBullets = linesToList(input.hubSubBulletsText);

  return {
    slug: slug as ServiceSlug,
    title,
    description: input.overview.trim() || input.hubDescriptor.trim(),
    image: input.hubImage.trim(),
    tag: input.hubTag,
    descriptor: input.hubDescriptor.trim(),
    ...(input.hubPreview.trim() ? { preview: input.hubPreview.trim() } : {}),
    ...(subBullets.length > 0 ? { subBullets } : {}),
  };
}

export function mergeHubCardsForPreview(
  hubCards: ServiceHubCard[],
  draft: ServiceHubCard | null,
  slug: string,
): ServiceHubCard[] {
  if (!draft || !slug.trim()) return hubCards;

  const normalized = slug.trim() as ServiceSlug;
  const index = hubCards.findIndex((card) => card.slug === normalized);

  if (index >= 0) {
    const next = [...hubCards];
    next[index] = draft;
    return next;
  }

  return [...hubCards, draft];
}
