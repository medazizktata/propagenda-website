import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapCaseStudyRow } from '@/lib/cms/mappers';
import { getDb } from '@/lib/d1/client';
import { parseJsonColumns, CASE_STUDY_JSON_COLUMNS } from '@/lib/d1/parseRow';
import { allCaseStudies, caseStudiesBySlug } from '@/content/work';
import type { CaseStudyRow } from '@/types/cms';
import type { CaseStudyRecord } from '@/types/content';

/** Public case-study reads — D1 when reachable, else `content/work` seed. */
export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | undefined> {
  if (!usesDatabaseContent()) {
    return caseStudiesBySlug[slug as keyof typeof caseStudiesBySlug];
  }

  const db = getDb()!;
  const row = await db
    .prepare('SELECT * FROM case_studies WHERE slug = ?1 AND locale = ?2 AND status = ?3')
    .bind(slug, getDefaultLocale(), 'published')
    .first<Record<string, unknown>>();

  if (!row) return undefined;

  return mapCaseStudyRow(parseJsonColumns<CaseStudyRow>(row, CASE_STUDY_JSON_COLUMNS));
}

export async function getAllCaseStudies(): Promise<CaseStudyRecord[]> {
  if (!usesDatabaseContent()) return allCaseStudies;

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT * FROM case_studies WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<Record<string, unknown>>();

  return results.map((row) => mapCaseStudyRow(parseJsonColumns<CaseStudyRow>(row, CASE_STUDY_JSON_COLUMNS)));
}

export async function getWorkSlugs(): Promise<string[]> {
  if (!usesDatabaseContent()) return allCaseStudies.map((c) => c.slug);

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT slug FROM case_studies WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<{ slug: string }>();

  return results.map((row) => row.slug);
}
