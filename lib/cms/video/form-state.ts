import type { VideoProjectRow } from '@/types/cms';
import { emptyVideoEditorValues, type VideoEditorInput } from '@/lib/cms/video/schema';

export function videoRowToEditorValues(row: VideoProjectRow): VideoEditorInput {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    sortOrder: row.sort_order,
    isShowreel: Boolean(row.is_showreel),
    src: row.src ?? '',
    poster: row.poster,
    orientation: (row.orientation as VideoEditorInput['orientation']) ?? 'landscape',
    width: row.width,
    height: row.height,
    duration: row.duration ?? '',
    client: row.client ?? '',
    description: row.description ?? '',
    placeholder: Boolean(row.placeholder),
  };
}

export { emptyVideoEditorValues };
