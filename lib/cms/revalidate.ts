export async function revalidateContentPaths(paths: string[]): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';

  if (!secret) {
    throw new Error('REVALIDATE_SECRET is not configured');
  }

  const response = await fetch(new URL('/api/revalidate', siteUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': secret,
    },
    body: JSON.stringify({ paths }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Revalidate failed (${response.status}): ${body}`);
  }
}

export const SERVICE_REVALIDATE_PATHS = ['/services', '/'] as const;

export function serviceDetailRevalidatePaths(slug: string): string[] {
  return [...SERVICE_REVALIDATE_PATHS, `/services/${slug}`];
}

export const WORK_REVALIDATE_PATHS = ['/work'] as const;

export function caseStudyRevalidatePaths(slug: string): string[] {
  return [...WORK_REVALIDATE_PATHS, `/work/${slug}`];
}

export const VIDEO_REVALIDATE_PATHS = ['/work/video', '/work'] as const;

export function videoProjectRevalidatePaths(): string[] {
  return [...VIDEO_REVALIDATE_PATHS];
}
