import { getDefaultLocale } from '@/lib/cms/config';
import { getDb } from '@/lib/d1/client';
import { CASE_STUDY_JSON_COLUMNS, parseJsonColumns } from '@/lib/d1/parseRow';
import type { CaseStudyListRow, CaseStudyRow } from '@/types/cms';

/** See lib/cms/repositories/admin/services.ts's withStringId for why. */
function withStringId<T extends Record<string, unknown>>(row: T): T {
  return { ...row, id: String(row.id) };
}

export async function listAdminCaseStudies(): Promise<CaseStudyListRow[]> {
  const db = getDb()!;
  const { results } = await db
    .prepare(
      'SELECT id, slug, title, status, sort_order, updated_at FROM case_studies WHERE locale = ?1 ORDER BY sort_order ASC',
    )
    .bind(getDefaultLocale())
    .all<Record<string, unknown>>();

  return results.map((row) => withStringId(row)) as unknown as CaseStudyListRow[];
}

export async function getAdminCaseStudyBySlug(slug: string): Promise<CaseStudyRow | null> {
  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM case_studies WHERE slug = ?1 AND locale = ?2')
    .bind(slug, getDefaultLocale())
    .first<Record<string, unknown>>();

  if (!row) return null;
  return withStringId(parseJsonColumns<CaseStudyRow>(row, CASE_STUDY_JSON_COLUMNS));
}

export async function getAdminCaseStudyById(id: string): Promise<CaseStudyRow | null> {
  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM case_studies WHERE id = ?1')
    .bind(Number(id))
    .first<Record<string, unknown>>();

  if (!row) return null;
  return withStringId(parseJsonColumns<CaseStudyRow>(row, CASE_STUDY_JSON_COLUMNS));
}

export async function isCaseStudySlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const db = getDb()!;
  const sql = excludeId
    ? 'SELECT id FROM case_studies WHERE slug = ?1 AND locale = ?2 AND id != ?3 LIMIT 1'
    : 'SELECT id FROM case_studies WHERE slug = ?1 AND locale = ?2 LIMIT 1';
  const bindings = excludeId
    ? [slug, getDefaultLocale(), Number(excludeId)]
    : [slug, getDefaultLocale()];

  const row = await db
    .prepare(sql)
    .bind(...bindings)
    .first();
  return Boolean(row);
}
