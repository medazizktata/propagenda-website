import { notFound } from 'next/navigation';
import { ServiceDetailContent } from '@/components/templates/ServiceDetailContent';
import { getService } from '@/lib/content/getService';
import { getServiceHubCards } from '@/lib/content/getServiceHubCards';
import { buildMetadata } from '@/lib/seo/metadata';
import type { ServiceSlug } from '@/types/content';

// See app/work/[slug]/page.tsx for why there's no generateStaticParams here.
export const revalidate = 300;

interface ServiceDetailPageProps {
  params: Promise<{ slug: ServiceSlug }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata(service.seo, `/services/${slug}`);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, hubCards] = await Promise.all([getService(slug), getServiceHubCards()]);
  if (!service) notFound();

  return <ServiceDetailContent service={service} hubCards={hubCards} />;
}
