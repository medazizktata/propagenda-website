'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminIdentity } from '@/lib/cms/auth';
import { getDefaultLocale } from '@/lib/cms/config';
import { getDb } from '@/lib/d1/client';
import { CASE_STUDY_JSON_COLUMNS, stringifyJsonColumns } from '@/lib/d1/parseRow';
import {
  getAdminCaseStudyById,
  isCaseStudySlugTaken,
} from '@/lib/cms/repositories/admin/caseStudies';
import {
  buildCaseStudyPayload,
  caseStudyEditorSchema,
} from '@/lib/cms/case-studies/schema';
import type { ContentStatus } from '@/types/cms';

export type CaseStudyActionResult =
  | { ok: true; id: string; slug: string; status: ContentStatus }
  | { ok: false; error: string };

function formToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') values[key] = value;
  }
  return values;
}

function parseCaseStudyForm(formData: FormData) {
  const parsed = caseStudyEditorSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    return { ok: false as const, error: message };
  }

  try {
    return { ok: true as const, payload: buildCaseStudyPayload(parsed.data) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Invalid form data',
    };
  }
}

function dbRowFromPayload(
  payload: ReturnType<typeof buildCaseStudyPayload>,
  status: ContentStatus,
  publishedAt: string | null,
) {
  const row = { ...payload, locale: getDefaultLocale(), status, published_at: publishedAt };
  return stringifyJsonColumns(row, CASE_STUDY_JSON_COLUMNS);
}

function resolveStatus(current: ContentStatus | null, intent: string | null): ContentStatus {
  if (intent === 'publish') return 'published';
  if (intent === 'draft') return 'draft';
  return current ?? 'draft';
}

function resolvePublishedAt(
  nextStatus: ContentStatus,
  currentStatus: ContentStatus | null,
  currentPublishedAt: string | null,
): string | null {
  if (nextStatus === 'published') {
    return currentPublishedAt ?? new Date().toISOString();
  }
  return null;
}

function revalidatePublished(slug: string, previousSlug?: string) {
  revalidatePath(`/work/${slug}`);
  revalidatePath('/work');
  if (previousSlug && previousSlug !== slug) revalidatePath(`/work/${previousSlug}`);
}

export async function createCaseStudy(formData: FormData): Promise<CaseStudyActionResult> {
  await requireAdminIdentity();

  const parsed = parseCaseStudyForm(formData);
  if (!parsed.ok) return parsed;

  if (await isCaseStudySlugTaken(parsed.payload.slug)) {
    return { ok: false, error: 'Slug is already in use' };
  }

  const intent = formData.get('intent');
  const status = resolveStatus(null, typeof intent === 'string' ? intent : null);
  const publishedAt = status === 'published' ? new Date().toISOString() : null;
  const row = dbRowFromPayload(parsed.payload, status, publishedAt);

  const db = getDb()!;
  const columns = Object.keys(row);
  const placeholders = columns.map((_, i) => `?${i + 1}`).join(', ');
  const result = await db
    .prepare(
      `INSERT INTO case_studies (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, slug, status`,
    )
    .bind(...columns.map((c) => row[c]))
    .first<{ id: number; slug: string; status: string }>();

  if (!result) return { ok: false, error: 'Insert failed' };

  revalidatePath('/admin/case-studies');
  if (status === 'published') revalidatePublished(result.slug);

  return { ok: true, id: String(result.id), slug: result.slug, status: result.status as ContentStatus };
}

export async function updateCaseStudy(
  id: string,
  previousSlug: string,
  formData: FormData,
): Promise<CaseStudyActionResult> {
  await requireAdminIdentity();

  const existing = await getAdminCaseStudyById(id);
  if (!existing) return { ok: false, error: 'Case study not found' };

  const parsed = parseCaseStudyForm(formData);
  if (!parsed.ok) return parsed;

  if (parsed.payload.slug !== existing.slug && existing.status === 'published') {
    return { ok: false, error: 'Unpublish before changing the slug' };
  }

  if (await isCaseStudySlugTaken(parsed.payload.slug, id)) {
    return { ok: false, error: 'Slug is already in use' };
  }

  const intent = formData.get('intent');
  const status = resolveStatus(existing.status, typeof intent === 'string' ? intent : null);
  const publishedAt = resolvePublishedAt(status, existing.status, existing.published_at);
  const row = dbRowFromPayload(parsed.payload, status, publishedAt);

  const db = getDb()!;
  const columns = Object.keys(row);
  const assignments = columns.map((c, i) => `${c} = ?${i + 1}`).join(', ');
  const result = await db
    .prepare(
      `UPDATE case_studies SET ${assignments} WHERE id = ?${columns.length + 1} RETURNING id, slug, status`,
    )
    .bind(...columns.map((c) => row[c]), Number(id))
    .first<{ id: number; slug: string; status: string }>();

  if (!result) return { ok: false, error: 'Update failed' };

  revalidatePath('/admin/case-studies');
  revalidatePath(`/admin/case-studies/${previousSlug}`);
  revalidatePath(`/admin/case-studies/${result.slug}`);
  if (status === 'published') revalidatePublished(result.slug, previousSlug);

  return { ok: true, id: String(result.id), slug: result.slug, status: result.status as ContentStatus };
}

export async function deleteCaseStudies(ids: string[]) {
  await requireAdminIdentity();

  if (ids.length === 0) return { ok: true as const };

  const db = getDb()!;
  const numericIds = ids.map(Number);
  const placeholders = numericIds.map((_, i) => `?${i + 1}`).join(', ');

  const { results: rows } = await db
    .prepare(`SELECT slug, status FROM case_studies WHERE id IN (${placeholders})`)
    .bind(...numericIds)
    .all<{ slug: string; status: string }>();

  const { success } = await db
    .prepare(`DELETE FROM case_studies WHERE id IN (${placeholders})`)
    .bind(...numericIds)
    .run();

  if (!success) return { ok: false as const, error: 'Delete failed' };

  revalidatePath('/admin/case-studies');

  for (const row of rows ?? []) {
    if (row.status === 'published') revalidatePublished(row.slug);
  }

  return { ok: true as const };
}
