import { notFound } from 'next/navigation';
import { CaseStudyDetailContent } from '@/components/templates/CaseStudyDetailContent';
import { getCaseStudy } from '@/lib/content/getCaseStudy';
import { getWorkSlugs } from '@/lib/content/getAllSlugs';
import { buildMetadata } from '@/lib/seo/metadata';
import type { WorkSlug } from '@/types/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

interface WorkDetailPageProps {
  params: Promise<{ slug: WorkSlug }>;
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata(study.seo, `/work/${slug}`);
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return <CaseStudyDetailContent study={study} />;
}
