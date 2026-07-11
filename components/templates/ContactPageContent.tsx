import { ContactSplitHero } from '@/components/sections/ContactSplitHero';
import { ContactInfoBlock } from '@/components/sections/ContactInfoBlock';
import { ContactForm } from '@/components/sections/ContactForm';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { contactPageHeading, contactSplitColumns } from '@/content/contact';

export function ContactPageContent() {
  return (
    <>
      <ContactSplitHero columns={[...contactSplitColumns]} />
      <section id="contact-form" className="px-gutter-m py-24 lg:px-gutter-d">
        <DisplayHeading as="h1" size="display-xs" className="mb-12">
          {contactPageHeading}
        </DisplayHeading>
        <div className="grid gap-16 lg:grid-cols-2">
          <ContactInfoBlock showWhatsApp />
          <ContactForm />
        </div>
      </section>
      <MediaPlaceholder
        label="Propagenda Team"
        accent="from-orange/20 to-navy"
        className="mx-gutter-m mb-24 min-h-48 rounded-lg lg:mx-gutter-d"
      />
    </>
  );
}
