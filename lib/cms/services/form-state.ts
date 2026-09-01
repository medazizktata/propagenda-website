import type { ServiceHubData } from '@/types/cms';
import type { ServiceRow } from '@/types/cms';
import type { GalleryImage, SeoMeta, ServiceRecord } from '@/types/content';
import {
  emptyServiceEditorValues,
  type ServiceEditorInput,
} from '@/lib/cms/services/schema';

function listToLines(values: string[] | null | undefined): string {
  return (values ?? []).join('\n');
}

function jsonToString(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value) && value.length === 0) return '';
  return JSON.stringify(value, null, 2);
}

export function serviceRowToEditorValues(row: ServiceRow): ServiceEditorInput {
  const hub = row.hub as ServiceHubData | null;
  const seo = row.seo as SeoMeta | null;
  const scopeItems = (row.scope_items ?? []) as unknown as string[];

  return {
    slug: row.slug,
    title: row.title,
    h1: row.h1,
    overview: row.overview,
    sortOrder: row.sort_order,
    scopeItemsText: listToLines(scopeItems),
    seoTitle: seo?.title ?? row.title,
    seoDescription: seo?.description ?? '',
    seoImage: seo?.image ?? '',
    hubImage: hub?.image ?? '',
    hubTag: hub?.tag ?? 'brand',
    hubDescriptor: hub?.descriptor ?? '',
    hubPreview: hub?.preview ?? '',
    hubSubBulletsText: listToLines(hub?.subBullets),
    galleryJson: jsonToString(row.gallery) || '[]',
    tiersJson: jsonToString(row.tiers),
    eventChecklistText: listToLines(row.event_checklist as unknown as string[]),
    extendedBulletsText: listToLines(row.extended_bullets as unknown as string[]),
    relatedWorkJson: jsonToString(row.related_work),
    tertiaryCtaJson: jsonToString(row.tertiary_cta),
  };
}

export function serviceRecordToEditorValues(record: ServiceRecord, hub: ServiceHubData | null): ServiceEditorInput {
  return {
    slug: record.slug,
    title: record.title,
    h1: record.h1,
    overview: record.overview,
    sortOrder: 0,
    scopeItemsText: listToLines(record.scopeItems),
    seoTitle: record.seo.title,
    seoDescription: record.seo.description,
    seoImage: record.seo.image ?? '',
    hubImage: hub?.image ?? '',
    hubTag: hub?.tag ?? 'brand',
    hubDescriptor: hub?.descriptor ?? '',
    hubPreview: hub?.preview ?? '',
    hubSubBulletsText: listToLines(hub?.subBullets),
    galleryJson: jsonToString(record.gallery) || '[]',
    tiersJson: jsonToString(record.tiers),
    eventChecklistText: listToLines(record.eventChecklist),
    extendedBulletsText: listToLines(record.extendedBullets),
    relatedWorkJson: jsonToString(record.relatedWork),
    tertiaryCtaJson: jsonToString(record.tertiaryCta),
  };
}

export { emptyServiceEditorValues };

export type AdminServiceDetail = ServiceRow;

export function galleryPreview(items: GalleryImage[]): string {
  return jsonToString(items) || '[]';
}
