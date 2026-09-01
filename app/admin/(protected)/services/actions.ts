'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/cms/auth';
import { getDefaultLocale } from '@/lib/cms/config';
import {
  getAdminServiceById,
  isServiceSlugTaken,
} from '@/lib/cms/repositories/admin/services';
import { buildServicePayload, serviceEditorSchema } from '@/lib/cms/services/schema';
import { revalidatePublishedService } from '@/lib/cms/services/revalidate-service';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database.types';
import type { ContentStatus } from '@/types/cms';

export type ServiceActionResult =
  | { ok: true; id: string; slug: string; status: ContentStatus }
  | { ok: false; error: string };

function formToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') values[key] = value;
  }
  return values;
}

function parseServiceForm(formData: FormData) {
  const parsed = serviceEditorSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    return { ok: false as const, error: message };
  }

  try {
    return { ok: true as const, input: parsed.data, payload: buildServicePayload(parsed.data) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Invalid form data',
    };
  }
}

function dbRowFromPayload(
  payload: ReturnType<typeof buildServicePayload>,
  status: ContentStatus,
  publishedAt: string | null,
) {
  return {
    slug: payload.slug,
    locale: getDefaultLocale(),
    status,
    sort_order: payload.sort_order,
    title: payload.title,
    h1: payload.h1,
    overview: payload.overview,
    scope_items: payload.scope_items as unknown as Json,
    gallery: payload.gallery as unknown as Json,
    seo: payload.seo as unknown as Json,
    tiers: payload.tiers as unknown as Json,
    event_checklist: payload.event_checklist as unknown as Json,
    extended_bullets: payload.extended_bullets as unknown as Json,
    related_work: payload.related_work as unknown as Json,
    tertiary_cta: payload.tertiary_cta as unknown as Json,
    hub: payload.hub as unknown as Json,
    published_at: publishedAt,
  };
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

export async function createService(formData: FormData): Promise<ServiceActionResult> {
  await requireAdminSession();

  const parsed = parseServiceForm(formData);
  if (!parsed.ok) return parsed;

  if (await isServiceSlugTaken(parsed.payload.slug)) {
    return { ok: false, error: 'Slug is already in use' };
  }

  const intent = formData.get('intent');
  const status = resolveStatus(null, typeof intent === 'string' ? intent : null);
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .insert(dbRowFromPayload(parsed.payload, status, publishedAt))
    .select('id, slug, status')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/services');
  if (status === 'published') {
    await revalidatePublishedService(data.slug);
  }

  return { ok: true, id: data.id, slug: data.slug, status: data.status as ContentStatus };
}

export async function updateService(
  id: string,
  previousSlug: string,
  formData: FormData,
): Promise<ServiceActionResult> {
  await requireAdminSession();

  const existing = await getAdminServiceById(id);
  if (!existing) return { ok: false, error: 'Service not found' };

  const parsed = parseServiceForm(formData);
  if (!parsed.ok) return parsed;

  if (parsed.payload.slug !== existing.slug && existing.status === 'published') {
    return { ok: false, error: 'Unpublish before changing the slug' };
  }

  if (await isServiceSlugTaken(parsed.payload.slug, id)) {
    return { ok: false, error: 'Slug is already in use' };
  }

  const intent = formData.get('intent');
  const status = resolveStatus(existing.status, typeof intent === 'string' ? intent : null);
  const publishedAt = resolvePublishedAt(status, existing.status, existing.published_at);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .update(dbRowFromPayload(parsed.payload, status, publishedAt))
    .eq('id', id)
    .select('id, slug, status')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${previousSlug}`);
  revalidatePath(`/admin/services/${data.slug}`);

  if (status === 'published') {
    await revalidatePublishedService(data.slug, previousSlug);
  }

  return { ok: true, id: data.id, slug: data.slug, status: data.status as ContentStatus };
}

export async function deleteServices(ids: string[]) {
  await requireAdminSession();

  if (ids.length === 0) return { ok: true as const };

  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase.from('services').select('slug, status').in('id', ids);

  const { error } = await supabase.from('services').delete().in('id', ids);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath('/admin/services');

  for (const row of rows ?? []) {
    if (row.status === 'published') {
      await revalidatePublishedService(row.slug);
    }
  }

  return { ok: true as const };
}
