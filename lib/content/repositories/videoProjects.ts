import { assertDatabaseContentReady, getDefaultLocale } from '@/lib/cms/config';
import { mapVideoRow } from '@/lib/cms/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { VideoProjectRow } from '@/types/cms';
import type { VideoProject } from '@/types/content';
import type { VideoWorkBundle } from '@/types/cms';

export async function getVideoWork(): Promise<VideoWorkBundle> {
  assertDatabaseContentReady();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('video_projects')
    .select('*')
    .eq('locale', getDefaultLocale())
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as VideoProjectRow[];
  const showreelRow = rows.find((row) => row.is_showreel);
  const projectRows = rows.filter((row) => !row.is_showreel);

  if (!showreelRow) {
    throw new Error('Published showreel missing from video_projects. Run pnpm seed:cms.');
  }

  return {
    showreel: mapVideoRow(showreelRow),
    projects: projectRows.map(mapVideoRow),
  };
}

export async function getAllVideoProjects(): Promise<VideoProject[]> {
  const bundle = await getVideoWork();
  return bundle.projects;
}
