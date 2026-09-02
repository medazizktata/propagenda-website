'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/marketing-button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServicesHeroLogo } from '@/components/sections/ServicesHeroLogo';
import { servicesBanner } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/** Home services teaser — split banner with the extruded monogram and a CTA into the hub. */
export function ServicesBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { label, headingLead, headingAccent, body, cta } = servicesBanner;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.svc-banner-reveal', {
        autoAlpha: 0,
        y: 32,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-charcoal px-gutter-m py-24 lg:px-gutter-d lg:py-32"
    >
      <div className="relative z-content mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.1fr)] lg:gap-16 xl:gap-20">
        <div className="max-w-xl">
          <SectionLabel className="svc-banner-reveal mb-5">{label}</SectionLabel>
          <DisplayHeading as="h2" size="display-sm" className="svc-banner-reveal mb-6">
            {headingLead} <span className="accent-word">{headingAccent}</span>
          </DisplayHeading>
          <p className="svc-banner-reveal max-w-sm text-lg leading-relaxed text-white/65">
            {body}
          </p>
          <div className="svc-banner-reveal mt-8">
            <Button href={cta.href} variant="primary-ghost" size="lg">
              {cta.label}
            </Button>
          </div>
        </div>

        <div className="svc-banner-reveal lg:justify-self-end">
          <ServicesHeroLogo />
        </div>
      </div>
    </section>
  );
}
