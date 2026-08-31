import type { CaseStudyRecord, ServiceRecord, ServiceSlug, VideoProject, WorkSlug } from '@/types/content';
import type { CaseStudyRow, ServiceHubData, ServiceRow, VideoProjectRow } from '@/types/cms';
import type { Json } from '@/types/database.types';
import type { ServiceHubCard } from '@/content/servicesHub';

export function serviceToRow(
  service: ServiceRecord,
  sortOrder: number,
  hub: ServiceHubData | null,
  locale = 'en',
): Omit<ServiceRow, 'id' | 'created_at' | 'updated_at' | 'published_at'> {
  return {
    slug: service.slug,
    locale,
    status: 'published',
    sort_order: sortOrder,
    title: service.title,
    h1: service.h1,
    overview: service.overview,
    scope_items: service.scopeItems as unknown as Json,
    gallery: service.gallery as unknown as Json,
    seo: service.seo as unknown as Json,
    tiers: (service.tiers ?? null) as unknown as Json,
    event_checklist: (service.eventChecklist ?? null) as unknown as Json,
    extended_bullets: (service.extendedBullets ?? null) as unknown as Json,
    related_work: (service.relatedWork ?? null) as unknown as Json,
    tertiary_cta: (service.tertiaryCta ?? null) as unknown as Json,
    hub: hub as unknown as Json,
  };
}

export function mapServiceRow(row: ServiceRow): ServiceRecord {
  return {
    slug: row.slug as ServiceSlug,
    title: row.title,
    h1: row.h1,
    overview: row.overview,
    scopeItems: (row.scope_items ?? []) as unknown as ServiceRecord['scopeItems'],
    gallery: (row.gallery ?? []) as unknown as ServiceRecord['gallery'],
    seo: row.seo as unknown as ServiceRecord['seo'],
    ...(row.tiers ? { tiers: row.tiers as unknown as ServiceRecord['tiers'] } : {}),
    ...(row.event_checklist
      ? { eventChecklist: row.event_checklist as unknown as ServiceRecord['eventChecklist'] }
      : {}),
    ...(row.extended_bullets
      ? { extendedBullets: row.extended_bullets as unknown as ServiceRecord['extendedBullets'] }
      : {}),
    ...(row.related_work
      ? { relatedWork: row.related_work as unknown as ServiceRecord['relatedWork'] }
      : {}),
    ...(row.tertiary_cta
      ? { tertiaryCta: row.tertiary_cta as unknown as ServiceRecord['tertiaryCta'] }
      : {}),
  };
}

export function mapServiceHubCard(row: ServiceRow): ServiceHubCard {
  const hub = row.hub as ServiceHubData | null;
  if (!hub) {
    throw new Error(`Service hub metadata missing for slug: ${row.slug}`);
  }

  return {
    slug: row.slug as ServiceSlug,
    title: row.title,
    description: row.overview,
    image: hub.image,
    tag: hub.tag,
    descriptor: hub.descriptor,
    ...(hub.preview ? { preview: hub.preview } : {}),
    ...(hub.subBullets ? { subBullets: hub.subBullets } : {}),
  };
}

export function caseStudyToRow(
  study: CaseStudyRecord,
  sortOrder: number,
  locale = 'en',
): Omit<CaseStudyRow, 'id' | 'created_at' | 'updated_at' | 'published_at'> {
  return {
    slug: study.slug,
    locale,
    status: 'published',
    sort_order: sortOrder,
    title: study.title,
    h1: study.h1,
    tier: study.tier,
    category: study.category,
    overview: study.overview,
    scope_items: study.scopeItems as unknown as Json,
    gallery: study.gallery as unknown as Json,
    seo: study.seo as unknown as Json,
    client: study.client ?? null,
    industry: study.industry ?? null,
    year: study.year ?? null,
    hero_image: study.heroImage ?? null,
    deliverables: (study.deliverables ?? null) as unknown as Json,
    results: (study.results ?? null) as unknown as Json,
    challenge: study.challenge ?? null,
    approach: study.approach ?? null,
    outcome: study.outcome ?? null,
    quote: (study.quote ?? null) as unknown as Json,
    accent: (study.accent ?? null) as unknown as Json,
    prev_slug: study.prev ?? null,
    next_slug: study.next ?? null,
  };
}

export function mapCaseStudyRow(row: CaseStudyRow): CaseStudyRecord {
  return {
    slug: row.slug as WorkSlug,
    title: row.title,
    h1: row.h1,
    tier: row.tier as CaseStudyRecord['tier'],
    category: row.category,
    overview: row.overview,
    scopeItems: (row.scope_items ?? []) as unknown as CaseStudyRecord['scopeItems'],
    gallery: (row.gallery ?? []) as unknown as CaseStudyRecord['gallery'],
    seo: row.seo as unknown as CaseStudyRecord['seo'],
    ...(row.client ? { client: row.client } : {}),
    ...(row.industry ? { industry: row.industry } : {}),
    ...(row.year ? { year: row.year } : {}),
    ...(row.hero_image ? { heroImage: row.hero_image } : {}),
    ...(row.deliverables
      ? { deliverables: row.deliverables as unknown as CaseStudyRecord['deliverables'] }
      : {}),
    ...(row.results
      ? { results: row.results as unknown as CaseStudyRecord['results'] }
      : {}),
    ...(row.challenge ? { challenge: row.challenge } : {}),
    ...(row.approach ? { approach: row.approach } : {}),
    ...(row.outcome ? { outcome: row.outcome } : {}),
    ...(row.quote ? { quote: row.quote as unknown as CaseStudyRecord['quote'] } : {}),
    ...(row.accent ? { accent: row.accent as unknown as CaseStudyRecord['accent'] } : {}),
    ...(row.prev_slug ? { prev: row.prev_slug as WorkSlug } : {}),
    ...(row.next_slug ? { next: row.next_slug as WorkSlug } : {}),
  };
}

export function videoToRow(
  video: VideoProject,
  sortOrder: number,
  isShowreel: boolean,
  locale = 'en',
): Omit<VideoProjectRow, 'id' | 'created_at' | 'updated_at' | 'published_at'> {
  return {
    slug: video.slug,
    locale,
    status: 'published',
    sort_order: sortOrder,
    is_showreel: isShowreel,
    title: video.title,
    category: video.category,
    src: video.src,
    poster: video.poster,
    orientation: video.orientation,
    width: video.width,
    height: video.height,
    duration: video.duration ?? null,
    client: video.client ?? null,
    description: video.description ?? null,
    placeholder: video.placeholder ?? false,
  };
}

export function mapVideoRow(row: VideoProjectRow): VideoProject {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    src: row.src,
    poster: row.poster,
    orientation: row.orientation as VideoProject['orientation'],
    width: row.width,
    height: row.height,
    ...(row.duration ? { duration: row.duration } : {}),
    ...(row.client ? { client: row.client } : {}),
    ...(row.description ? { description: row.description } : {}),
    ...(row.placeholder ? { placeholder: row.placeholder } : {}),
  };
}
