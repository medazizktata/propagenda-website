import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapCaseStudyRow } from '@/lib/cms/mappers';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { allCaseStudies, caseStudiesBySlug } from '@/content/work';
import type { CaseStudyRow } from '@/types/cms';
import type { CaseStudyRecord } from '@/types/content';

/** Public case-study reads — Supabase when configured, else `content/work` seed. */
export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | undefined> {
  if (!usesDatabaseContent()) {
    return caseStudiesBySlug[slug as keyof typeof caseStudiesBySlug];
  }

  const supabase = createSupabaseStaticClient();
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
  if (!usesDatabaseContent()) return allCaseStudies;

  const supabase = createSupabaseStaticClient();
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
  if (!usesDatabaseContent()) return allCaseStudies.map((c) => c.slug);

  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from('case_studies')
    .select('slug')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => row.slug);
}
