import { buildMetadata } from '@/lib/seo/metadata';
import { getAllCaseStudies } from '@/lib/content/getCaseStudy';
import { WorkPageContent } from '@/components/templates/WorkPageContent';

export const metadata = buildMetadata(
  {
    title: 'Our Work | Propagenda',
    description:
      'Featured branding and marketing case studies, Sanapex, P2P Motors, Dose Pharmacy, and more.',
  },
  '/work',
);

// See app/work/[slug]/page.tsx for why this reads D1 at request time (ISR-cached)
// rather than being statically generated at build time.
export const revalidate = 300;

export default async function WorkPage() {
  const caseStudies = await getAllCaseStudies();

  return <WorkPageContent caseStudies={caseStudies} />;
}
