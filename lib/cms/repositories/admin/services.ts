import { getDefaultLocale } from '@/lib/cms/config';
import { mapServiceHubCard } from '@/lib/cms/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ServiceHubCard } from '@/content/servicesHub';
import type { ServiceListRow, ServiceRow } from '@/types/cms';

export async function listAdminServices(): Promise<ServiceListRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, status, sort_order, updated_at')
    .eq('locale', getDefaultLocale())
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ServiceListRow[];
}

export async function listAdminServiceHubCards(): Promise<ServiceHubCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('locale', getDefaultLocale())
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data as ServiceRow[])
    .filter((row) => row.hub != null)
    .map((row) => mapServiceHubCard(row));
}

export async function getAdminServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('locale', getDefaultLocale())
    .maybeSingle();

  if (error) throw error;
  return (data as ServiceRow | null) ?? null;
}

export async function getAdminServiceById(id: string): Promise<ServiceRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as ServiceRow | null) ?? null;
}

export async function isServiceSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('services')
    .select('id')
    .eq('slug', slug)
    .eq('locale', getDefaultLocale());

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
