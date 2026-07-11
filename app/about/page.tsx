import { buildMetadata } from '@/lib/seo/metadata';
import { AboutPageContent } from '@/components/templates/AboutPageContent';

export const metadata = buildMetadata(
  {
    title: 'About | Propagenda',
    description:
      'Professional Planned Agenda — holistic marketing strategies for businesses of all sizes in Dubai and the UAE.',
  },
  '/about',
);

export default function AboutPage() {
  return <AboutPageContent />;
}
