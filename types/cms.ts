import type { CaseStudyRecord, ServiceRecord, VideoProject } from '@/types/content';

export type ContentStatus = 'draft' | 'published';

export type ServiceDiscipline = 'brand' | 'digital' | 'production' | 'experience';

export interface ServiceHubData {
  image: string;
  tag: ServiceDiscipline;
  descriptor: string;
  preview?: string;
  subBullets?: string[];
}

export interface ServiceRow {
  id: string;
  slug: string;
  locale: string;
  status: ContentStatus;
  sort_order: number;
  title: string;
  h1: string;
  overview: string;
  scope_items: ServiceRecord['scopeItems'];
  gallery: ServiceRecord['gallery'];
  seo: ServiceRecord['seo'];
  tiers: ServiceRecord['tiers'] | null;
  event_checklist: ServiceRecord['eventChecklist'] | null;
  extended_bullets: ServiceRecord['extendedBullets'] | null;
  related_work: ServiceRecord['relatedWork'] | null;
  tertiary_cta: ServiceRecord['tertiaryCta'] | null;
  hub: ServiceHubData | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyRow {
  id: string;
  slug: string;
  locale: string;
  status: ContentStatus;
  sort_order: number;
  title: string;
  h1: string;
  tier: CaseStudyRecord['tier'];
  category: string;
  overview: string;
  scope_items: CaseStudyRecord['scopeItems'];
  gallery: CaseStudyRecord['gallery'];
  seo: CaseStudyRecord['seo'];
  client: string | null;
  industry: string | null;
  year: string | null;
  hero_image: string | null;
  deliverables: CaseStudyRecord['deliverables'] | null;
  results: CaseStudyRecord['results'] | null;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  quote: CaseStudyRecord['quote'] | null;
  accent: CaseStudyRecord['accent'] | null;
  prev_slug: string | null;
  next_slug: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoProjectRow {
  id: string;
  slug: string;
  locale: string;
  status: ContentStatus;
  sort_order: number;
  is_showreel: boolean;
  title: string;
  category: string;
  src: string;
  poster: string;
  orientation: VideoProject['orientation'];
  width: number;
  height: number;
  duration: string | null;
  client: string | null;
  description: string | null;
  placeholder: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoWorkBundle {
  showreel: VideoProject;
  projects: VideoProject[];
}
