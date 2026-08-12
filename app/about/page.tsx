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
  return (
    <>
      {/* The immersive statements are giant <p>s by design; the page still needs a heading. */}
      <h1 className="sr-only">About Propagenda</h1>
      <AboutPageContent />
    </>
  );
}
