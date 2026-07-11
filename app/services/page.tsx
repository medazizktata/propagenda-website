import { buildMetadata } from '@/lib/seo/metadata';
import { ServicesPageContent } from '@/components/templates/ServicesPageContent';

export const metadata = buildMetadata(
  {
    title: 'Marketing Services | Propagenda',
    description:
      'Eight integrated service lines from branding and PR to websites, events, and photography. Explore our capabilities.',
  },
  '/services',
);

export default function ServicesPage() {
  return <ServicesPageContent />;
}
