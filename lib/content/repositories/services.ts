import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapServiceHubCard, mapServiceRow } from '@/lib/cms/mappers';
import { getDb } from '@/lib/d1/client';
import { parseJsonColumns, SERVICE_JSON_COLUMNS } from '@/lib/d1/parseRow';
import { allServices, servicesBySlug } from '@/content/services';
import { serviceHubCards, type ServiceHubCard } from '@/content/servicesHub';
import type { ServiceRow } from '@/types/cms';
import type { ServiceRecord } from '@/types/content';

/** Public service reads — D1 when reachable, else `content/services*` seed. */
export async function getService(slug: string): Promise<ServiceRecord | undefined> {
  if (!usesDatabaseContent()) {
    return servicesBySlug[slug as keyof typeof servicesBySlug];
  }

  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM services WHERE slug = ?1 AND locale = ?2 AND status = ?3')
    .bind(slug, getDefaultLocale(), 'published')
    .first<Record<string, unknown>>();

  if (!row) return undefined;

  return mapServiceRow(parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS));
}

export async function getAllServices(): Promise<ServiceRecord[]> {
  if (!usesDatabaseContent()) return allServices;

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT * FROM services WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<Record<string, unknown>>();

  return results.map((row) => mapServiceRow(parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS)));
}

export async function getServiceSlugs(): Promise<string[]> {
  if (!usesDatabaseContent()) return allServices.map((s) => s.slug);

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT slug FROM services WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<{ slug: string }>();

  return results.map((row) => row.slug);
}

export async function getServiceHubCards(): Promise<ServiceHubCard[]> {
  if (!usesDatabaseContent()) return serviceHubCards;

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT * FROM services WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<Record<string, unknown>>();

  return results.map((row) => mapServiceHubCard(parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS)));
}
