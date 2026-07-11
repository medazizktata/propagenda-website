import { buildMetadata } from '@/lib/seo/metadata';
import { ContactPageContent } from '@/components/templates/ContactPageContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { localBusinessJsonLd } from '@/lib/seo/jsonld';

export const metadata = buildMetadata(
  {
    title: 'Contact Us | Propagenda',
    description:
      'Book a free consultation — phone, email, WhatsApp, or contact form. Al Quoz, Dubai.',
  },
  '/contact',
);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <ContactPageContent />
    </>
  );
}
