import { buildMetadata } from '@/lib/seo/metadata';
import { WorkPageContent } from '@/components/templates/WorkPageContent';

export const metadata = buildMetadata(
  {
    title: 'Our Work | Propagenda',
    description:
      'Featured branding and marketing case studies — Sanapex, P2P Motors, Dose Pharmacy, and more.',
  },
  '/work',
);

export default function WorkPage() {
  return <WorkPageContent />;
}
