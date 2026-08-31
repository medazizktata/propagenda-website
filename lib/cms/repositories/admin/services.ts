import { getDefaultLocale } from '@/lib/cms/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ServiceListRow } from '@/types/cms';

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
