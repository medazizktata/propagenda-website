import { getDefaultLocale } from '@/lib/cms/config';
import { mapServiceHubCard } from '@/lib/cms/mappers';
import { getDb } from '@/lib/d1/client';
import { parseJsonColumns, SERVICE_JSON_COLUMNS } from '@/lib/d1/parseRow';
import type { ServiceHubCard } from '@/content/servicesHub';
import type { ServiceListRow, ServiceRow } from '@/types/cms';

/** D1's INTEGER PRIMARY KEY comes back as a JS number; every consumer of these
    rows (forms, table components, action signatures) was written against
    Supabase's uuid string id, so coerce it once at the repository boundary
    rather than threading `string | number` through the whole admin UI. */
function withStringId<T extends Record<string, unknown>>(row: T): T {
  return { ...row, id: String(row.id) };
}

export async function listAdminServices(): Promise<ServiceListRow[]> {
  const db = getDb()!;
  const { results } = await db
    .prepare(
      'SELECT id, slug, title, status, sort_order, updated_at FROM services WHERE locale = ?1 ORDER BY sort_order ASC',
    )
    .bind(getDefaultLocale())
    .all<Record<string, unknown>>();

  return results.map((row) => withStringId(row)) as unknown as ServiceListRow[];
}

export async function listAdminServiceHubCards(): Promise<ServiceHubCard[]> {
  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT * FROM services WHERE locale = ?1 ORDER BY sort_order ASC')
    .bind(getDefaultLocale())
    .all<Record<string, unknown>>();

  return results
    .map((row) => parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS))
    .filter((row) => row.hub != null)
    .map((row) => mapServiceHubCard(row));
}

export async function getAdminServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM services WHERE slug = ?1 AND locale = ?2')
    .bind(slug, getDefaultLocale())
    .first<Record<string, unknown>>();

  if (!row) return null;
  return withStringId(parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS));
}

export async function getAdminServiceById(id: string): Promise<ServiceRow | null> {
  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM services WHERE id = ?1')
    .bind(Number(id))
    .first<Record<string, unknown>>();

  if (!row) return null;
  return withStringId(parseJsonColumns<ServiceRow>(row, SERVICE_JSON_COLUMNS));
}

export async function isServiceSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const db = getDb()!;
  const sql = excludeId
    ? 'SELECT id FROM services WHERE slug = ?1 AND locale = ?2 AND id != ?3 LIMIT 1'
    : 'SELECT id FROM services WHERE slug = ?1 AND locale = ?2 LIMIT 1';
  const bindings = excludeId
    ? [slug, getDefaultLocale(), Number(excludeId)]
    : [slug, getDefaultLocale()];

  const row = await db
    .prepare(sql)
    .bind(...bindings)
    .first();
  return Boolean(row);
}
