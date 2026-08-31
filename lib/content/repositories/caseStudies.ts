import { assertDatabaseContentReady, getDefaultLocale } from '@/lib/cms/config';
import { mapCaseStudyRow } from '@/lib/cms/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CaseStudyRow } from '@/types/cms';
import type { CaseStudyRecord } from '@/types/content';

export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | undefined> {
  assertDatabaseContentReady();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  return mapCaseStudyRow(data as CaseStudyRow);
}

export async function getAllCaseStudies(): Promise<CaseStudyRecord[]> {
  assertDatabaseContentReady();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data as CaseStudyRow[]).map(mapCaseStudyRow);
}

export async function getWorkSlugs(): Promise<string[]> {
  assertDatabaseContentReady();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('case_studies')
    .select('slug')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => row.slug);
}
