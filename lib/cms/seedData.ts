import { allServices } from '@/content/services';
import { serviceHubCards } from '@/content/servicesHub';
import { allCaseStudies } from '@/content/work';
import { showreel, videoProjects } from '@/content/videoWork';
import { caseStudyToRow, serviceToRow, videoToRow } from '@/lib/cms/mappers';
import type { ServiceHubData } from '@/types/cms';

const hubBySlug = Object.fromEntries(
  serviceHubCards.map((card) => [
    card.slug,
    {
      image: card.image,
      tag: card.tag,
      descriptor: card.descriptor,
      ...(card.preview ? { preview: card.preview } : {}),
      ...(card.subBullets ? { subBullets: card.subBullets } : {}),
    } satisfies ServiceHubData,
  ]),
);

export function buildContentSeedRows() {
  const publishedAt = new Date().toISOString();

  const services = allServices.map((service, index) => ({
    ...serviceToRow(service, index, hubBySlug[service.slug] ?? null),
    published_at: publishedAt,
  }));

  const caseStudies = allCaseStudies.map((study, index) => ({
    ...caseStudyToRow(study, index),
    published_at: publishedAt,
  }));

  const videos = [
    { ...videoToRow(showreel, 0, true), published_at: publishedAt },
    ...videoProjects.map((video, index) => ({
      ...videoToRow(video, index + 1, false),
      published_at: publishedAt,
    })),
  ];

  return { services, caseStudies, videos };
}

export function resolveSeedAdminCredentials() {
  return {
    email: (process.env.CMS_DEFAULT_ADMIN_EMAIL ?? 'admin@thepropagenda.com').trim().toLowerCase(),
    password: process.env.CMS_DEFAULT_ADMIN_PASSWORD ?? 'PropagendaCMS!dev',
  };
}
