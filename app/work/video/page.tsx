import { buildMetadata } from '@/lib/seo/metadata';
import { getVideoWork } from '@/lib/content/repositories/videoProjects';
import { VideoWorkContent } from '@/components/templates/VideoWorkContent';

export const metadata = buildMetadata(
  {
    title: 'Video & Film | Propagenda',
    description:
      'Brand films, social reels, and motion, Propagenda in motion. Watch the showreel and our latest video work.',
  },
  '/work/video',
);

// See app/work/[slug]/page.tsx for why this reads D1 at request time (ISR-cached)
// rather than being statically generated at build time.
export const revalidate = 300;

export default async function VideoWorkPage() {
  const { showreel, projects } = await getVideoWork();

  return <VideoWorkContent showreel={showreel} videoProjects={projects} />;
}
