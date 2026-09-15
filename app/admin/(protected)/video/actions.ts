'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminIdentity } from '@/lib/cms/auth';
import { getDefaultLocale } from '@/lib/cms/config';
import { getDb } from '@/lib/d1/client';
import {
  getAdminVideoProjectById,
  isVideoSlugTaken,
} from '@/lib/cms/repositories/admin/videoProjects';
import { buildVideoPayload, videoEditorSchema } from '@/lib/cms/video/schema';
import type { ContentStatus } from '@/types/cms';

export type VideoActionResult =
  | { ok: true; id: string; slug: string; status: ContentStatus }
  | { ok: false; error: string };

function formToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') values[key] = value;
  }
  return values;
}

function parseVideoForm(formData: FormData) {
  const parsed = videoEditorSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    return { ok: false as const, error: message };
  }

  return { ok: true as const, payload: buildVideoPayload(parsed.data) };
}

function dbRowFromPayload(
  payload: ReturnType<typeof buildVideoPayload>,
  status: ContentStatus,
  publishedAt: string | null,
) {
  return { ...payload, locale: getDefaultLocale(), status, published_at: publishedAt };
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

function revalidatePublished() {
  revalidatePath('/work/video');
}

export async function createVideoProject(formData: FormData): Promise<VideoActionResult> {
  await requireAdminIdentity();

  const parsed = parseVideoForm(formData);
  if (!parsed.ok) return parsed;

  if (await isVideoSlugTaken(parsed.payload.slug)) {
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
      `INSERT INTO video_projects (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, slug, status`,
    )
    .bind(...columns.map((c) => (row as Record<string, unknown>)[c]))
    .first<{ id: number; slug: string; status: string }>();

  if (!result) return { ok: false, error: 'Insert failed' };

  revalidatePath('/admin/video');
  if (status === 'published') revalidatePublished();

  return { ok: true, id: String(result.id), slug: result.slug, status: result.status as ContentStatus };
}

export async function updateVideoProject(
  id: string,
  previousSlug: string,
  formData: FormData,
): Promise<VideoActionResult> {
  await requireAdminIdentity();

  const existing = await getAdminVideoProjectById(id);
  if (!existing) return { ok: false, error: 'Video project not found' };

  const parsed = parseVideoForm(formData);
  if (!parsed.ok) return parsed;

  if (parsed.payload.slug !== existing.slug && existing.status === 'published') {
    return { ok: false, error: 'Unpublish before changing the slug' };
  }

  if (await isVideoSlugTaken(parsed.payload.slug, id)) {
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
      `UPDATE video_projects SET ${assignments} WHERE id = ?${columns.length + 1} RETURNING id, slug, status`,
    )
    .bind(...columns.map((c) => (row as Record<string, unknown>)[c]), Number(id))
    .first<{ id: number; slug: string; status: string }>();

  if (!result) return { ok: false, error: 'Update failed' };

  revalidatePath('/admin/video');
  revalidatePath(`/admin/video/${previousSlug}`);
  revalidatePath(`/admin/video/${result.slug}`);
  if (status === 'published') revalidatePublished();

  return { ok: true, id: String(result.id), slug: result.slug, status: result.status as ContentStatus };
}

export async function deleteVideoProjects(ids: string[]) {
  await requireAdminIdentity();

  if (ids.length === 0) return { ok: true as const };

  const db = getDb()!;
  const numericIds = ids.map(Number);
  const placeholders = numericIds.map((_, i) => `?${i + 1}`).join(', ');

  const { results: rows } = await db
    .prepare(`SELECT slug, status FROM video_projects WHERE id IN (${placeholders})`)
    .bind(...numericIds)
    .all<{ slug: string; status: string }>();

  const { success } = await db
    .prepare(`DELETE FROM video_projects WHERE id IN (${placeholders})`)
    .bind(...numericIds)
    .run();

  if (!success) return { ok: false as const, error: 'Delete failed' };

  revalidatePath('/admin/video');

  if ((rows ?? []).some((row) => row.status === 'published')) {
    revalidatePublished();
  }

  return { ok: true as const };
}
