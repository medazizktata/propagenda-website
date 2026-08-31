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

export default async function WorkPage() {
  const caseStudies = await getAllCaseStudies();

  return <WorkPageContent caseStudies={caseStudies} />;
}
