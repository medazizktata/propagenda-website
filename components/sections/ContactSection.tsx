import Image from 'next/image';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactInfoBlock } from '@/components/sections/ContactInfoBlock';

export function ContactSection() {
  return (
    <section className="relative overflow-hidden px-gutter-m py-32 lg:px-gutter-d">
      {/*
        Decorative brand monogram (brand guidelines PDF p.20), dropped into the empty
        lower-left of the section as a sign-off mark. It shares the page's charcoal
        ground, so at low opacity only the orange mark ghosts through and the continuous
        #252525 background stays seamless. A soft gradient melts its edges into charcoal.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-[-5%] -z-0 hidden aspect-[16/9] w-[560px] opacity-[0.18] lg:block xl:w-[680px]"
      >
        <Image
          src="/images/brand/monogram-hero.png"
          alt=""
          fill
          sizes="680px"
          className="object-contain object-left-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-charcoal/30 to-charcoal" />
      </div>

      <div className="relative z-content">
        <SectionLabel>Contact us</SectionLabel>
        <DisplayHeading as="h2" size="display-sm" className="mb-12 mt-3">
          Let&apos;s start a <span className="accent-word">conversation</span>
        </DisplayHeading>
        <div className="grid gap-16 lg:grid-cols-2">
          <ContactInfoBlock />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
