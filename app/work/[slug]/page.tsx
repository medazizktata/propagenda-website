import { notFound } from 'next/navigation';
import { CaseStudyDetailContent } from '@/components/templates/CaseStudyDetailContent';
import { getCaseStudy } from '@/lib/content/getCaseStudy';
import { getWorkSlugs } from '@/lib/content/getAllSlugs';
import { buildMetadata } from '@/lib/seo/metadata';
import type { WorkSlug } from '@/types/content';

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

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
