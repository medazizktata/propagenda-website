import { buildMetadata } from '@/lib/seo/metadata';
import { getServiceHubCards } from '@/lib/content/getServiceHubCards';
import { ServicesPageContent } from '@/components/templates/ServicesPageContent';

export const metadata = buildMetadata(
  {
    title: 'Marketing Services | Propagenda',
    description:
      'Seven integrated service lines from branding and PR to websites, events, and photography. Explore our capabilities.',
  },
  '/services',
);

export default async function ServicesPage() {
  const hubCards = await getServiceHubCards();

  return <ServicesPageContent hubCards={hubCards} />;
}
