import { buildMetadata } from '@/lib/seo/metadata';
import { HomePageContent } from '@/components/templates/HomePageContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd } from '@/lib/seo/jsonld';

export const metadata = buildMetadata(
  {
    title: 'Where creativity meets strategy | Propagenda',
    description:
      "Dubai's 360° marketing agency — branding, digital, events, print & install. View our work and book a free consultation.",
  },
  '/',
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HomePageContent />
    </>
  );
}
