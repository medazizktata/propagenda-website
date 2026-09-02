import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapVideoRow } from '@/lib/cms/mappers';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { showreel, videoProjects } from '@/content/videoWork';
import type { VideoProjectRow } from '@/types/cms';
import type { VideoProject } from '@/types/content';
import type { VideoWorkBundle } from '@/types/cms';

/** Public video work — Supabase when configured, else `content/videoWork` seed. */
export async function getVideoWork(): Promise<VideoWorkBundle> {
  if (!usesDatabaseContent()) {
    return { showreel, projects: videoProjects };
  }

  const supabase = createSupabaseStaticClient();
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
