import { notFound } from 'next/navigation';
import { ServiceDetailContent } from '@/components/templates/ServiceDetailContent';
import { getService } from '@/lib/content/getService';
import { getServiceSlugs } from '@/lib/content/getAllSlugs';
import { buildMetadata } from '@/lib/seo/metadata';
import type { ServiceSlug } from '@/types/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: ServiceSlug }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata(service.seo, `/services/${slug}`);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return <ServiceDetailContent service={service} />;
}
