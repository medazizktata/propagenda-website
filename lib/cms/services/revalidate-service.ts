import { revalidatePath } from 'next/cache';
import {
  serviceDetailRevalidatePaths,
  SERVICE_REVALIDATE_PATHS,
  revalidateContentPaths,
} from '@/lib/cms/revalidate';

export async function revalidatePublishedService(slug: string, previousSlug?: string) {
  const paths = new Set<string>([...SERVICE_REVALIDATE_PATHS, ...serviceDetailRevalidatePaths(slug)]);

  if (previousSlug && previousSlug !== slug) {
    paths.add(`/services/${previousSlug}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/admin/services/${previousSlug}`);
  }

  if (process.env.REVALIDATE_SECRET) {
    try {
      await revalidateContentPaths([...paths]);
    } catch {
      // Local dev may not reach the revalidate route; Next cache bust above is enough.
    }
  }
}
