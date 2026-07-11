import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactInfoBlock } from '@/components/sections/ContactInfoBlock';

export function ContactSection() {
  return (
    <section className="border-t border-border bg-charcoal px-gutter-m py-32 lg:px-gutter-d">
      <SectionLabel>Contact us</SectionLabel>
      <DisplayHeading as="h2" size="display-xs" className="mb-12 mt-2">
        Let&apos;s start a conversation
      </DisplayHeading>
      <div className="grid gap-16 lg:grid-cols-2">
        <ContactInfoBlock />
        <ContactForm />
      </div>
    </section>
  );
}
