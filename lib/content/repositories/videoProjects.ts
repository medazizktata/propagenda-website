import { usesDatabaseContent, getDefaultLocale } from '@/lib/cms/config';
import { mapVideoRow } from '@/lib/cms/mappers';
import { getDb } from '@/lib/d1/client';
import { resolveMediaUrl } from '@/lib/r2/resolveMediaUrl';
import { showreel, videoProjects } from '@/content/videoWork';
import type { VideoProjectRow } from '@/types/cms';
import type { VideoProject } from '@/types/content';
import type { VideoWorkBundle } from '@/types/cms';

function resolveVideoMedia(video: VideoProject): VideoProject {
  return {
    ...video,
    src: resolveMediaUrl(video.src),
    poster: resolveMediaUrl(video.poster),
    ...(video.previewSrc ? { previewSrc: resolveMediaUrl(video.previewSrc) } : {}),
  };
}

/** Public video work — D1 when reachable, else `content/videoWork` seed. */
export async function getVideoWork(): Promise<VideoWorkBundle> {
  if (!usesDatabaseContent()) {
    return { showreel, projects: videoProjects };
  }

  const db = getDb()!;
  const { results } = await db
    .prepare('SELECT * FROM video_projects WHERE locale = ?1 AND status = ?2 ORDER BY sort_order ASC')
    .bind(getDefaultLocale(), 'published')
    .all<Record<string, unknown>>();

  // No JSON columns on this table (see d1/migrations/0001), but SQLite has no
  // native boolean — is_showreel/placeholder come back as 0/1 integers, so coerce
  // them before they reach code (or types) expecting real booleans.
  const rows = results.map((row) => ({
    ...row,
    is_showreel: Boolean(row.is_showreel),
    placeholder: Boolean(row.placeholder),
  })) as unknown as VideoProjectRow[];
  const showreelRow = rows.find((row) => row.is_showreel);
  const projectRows = rows.filter((row) => !row.is_showreel);

  if (!showreelRow) {
    throw new Error('Published showreel missing from video_projects. Run pnpm seed:cms / the D1 import.');
  }

  return {
    showreel: resolveVideoMedia(mapVideoRow(showreelRow)),
    projects: projectRows.map((row) => resolveVideoMedia(mapVideoRow(row))),
  };
}

export async function getAllVideoProjects(): Promise<VideoProject[]> {
  const bundle = await getVideoWork();
  return bundle.projects;
}
