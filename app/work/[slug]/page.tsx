import { notFound } from 'next/navigation';
import { CaseStudyDetailContent } from '@/components/templates/CaseStudyDetailContent';
import { getCaseStudy } from '@/lib/content/getCaseStudy';
import { buildMetadata } from '@/lib/seo/metadata';
import type { WorkSlug } from '@/types/content';

// No generateStaticParams: pages render on first real request against the real D1
// binding (next build runs outside a Workers request and would only see
// local/simulated D1 data), then cache per this revalidate window (ISR) instead of
// needing a build-time enumeration step.
export const revalidate = 300;

interface WorkDetailPageProps {
  params: Promise<{ slug: WorkSlug }>;
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata(study.seo, `/work/${slug}`);
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const [prevStudy, nextStudy] = await Promise.all([
    study.prev ? getCaseStudy(study.prev) : Promise.resolve(undefined),
    study.next ? getCaseStudy(study.next) : Promise.resolve(undefined),
  ]);

  return (
    <CaseStudyDetailContent study={study} prevStudy={prevStudy} nextStudy={nextStudy} />
  );
}
