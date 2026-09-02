import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapServiceHubCard, mapServiceRow } from '@/lib/cms/mappers';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { allServices, servicesBySlug } from '@/content/services';
import { serviceHubCards, type ServiceHubCard } from '@/content/servicesHub';
import type { ServiceRow } from '@/types/cms';
import type { ServiceRecord } from '@/types/content';

/**
 * Public service reads: Supabase when configured, else seed modules under
 * `content/services*` so CF Builds / local SSG works without secrets.
 */
export async function getService(slug: string): Promise<ServiceRecord | undefined> {
  if (!usesDatabaseContent()) {
    return servicesBySlug[slug as keyof typeof servicesBySlug];
  }

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
  if (!usesDatabaseContent()) return allServices;

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
  if (!usesDatabaseContent()) return allServices.map((s) => s.slug);

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
  if (!usesDatabaseContent()) return serviceHubCards;

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
