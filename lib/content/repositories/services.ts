import { assertDatabaseContentReady, getDefaultLocale } from '@/lib/cms/config';
import { mapServiceHubCard, mapServiceRow } from '@/lib/cms/mappers';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import type { ServiceHubCard } from '@/content/servicesHub';
import type { ServiceRow } from '@/types/cms';
import type { ServiceRecord } from '@/types/content';

export async function getService(slug: string): Promise<ServiceRecord | undefined> {
  assertDatabaseContentReady();

  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  return mapServiceRow(data as ServiceRow);
}

export async function getAllServices(): Promise<ServiceRecord[]> {
  assertDatabaseContentReady();

  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data as ServiceRow[]).map(mapServiceRow);
}

export async function getServiceSlugs(): Promise<string[]> {
  assertDatabaseContentReady();

  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from('services')
    .select('slug')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => row.slug);
}

export async function getServiceHubCards(): Promise<ServiceHubCard[]> {
  assertDatabaseContentReady();

  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data as ServiceRow[]).map(mapServiceHubCard);
}
