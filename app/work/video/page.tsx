import { buildMetadata } from '@/lib/seo/metadata';
import { VideoWorkContent } from '@/components/templates/VideoWorkContent';

export const metadata = buildMetadata(
  {
    title: 'Video & Film | Propagenda',
    description:
      'Brand films, social reels, and motion, Propagenda in motion. Watch the showreel and our latest video work.',
  },
  '/work/video',
);

export default function VideoWorkPage() {
  return <VideoWorkContent />;
}
