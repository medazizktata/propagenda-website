'use client';

import { useEffect, useRef } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServicesHeroLogo } from '@/components/sections/ServicesHeroLogo';
import { servicesBanner } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Act 1 of the Services page — split hero with the extruded monogram and a scroll handoff into the index.
 */
export function ServicesStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { headingLead, headingAccent } = servicesBanner;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.svc-stmt-line');
      if (reducedMotion) {
        gsap.set(lines, { autoAlpha: 1, yPercent: 0 });
        return;
      }
      gsap.set(lines, { autoAlpha: 0, yPercent: 45 });
      gsap.to(lines, {
        autoAlpha: 1,
        yPercent: 0,
        ease: 'power3.out',
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
        immediateRender: false,
      });

      gsap.to('.svc-hero-content', {
        yPercent: -18,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Explicit user direction (2026-09-24): drop the "Seven capabilities" line, keep "The whole
  // brand," on ONE line, bigger 3D logo — then: text on the side, with the single line 1 set
  // smaller than line 2. The text column is its own containment context, so both lines are sized
  // in cqw: line 1 measures 10.0x its font size, so 9.4cqw holds it at ~94% of the column at every
  // width; line 2 is the loud one. Browsers without container units fall back to the vw sizes.
  // The two visual lines are aria-hidden; the real h1 is one sr-only sentence.
  const lineClass =
    'svc-stmt-line block whitespace-nowrap font-sans font-bold uppercase leading-[0.95] tracking-display';
  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[min(100svh,920px)] items-center overflow-hidden bg-charcoal"
    >
      <div className="svc-hero-content relative z-content mx-auto grid w-full max-w-[1920px] grid-cols-1 items-center gap-10 px-gutter-m py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-6 lg:px-gutter-d lg:py-24">
        <div className="min-w-0" style={{ containerType: 'inline-size' }}>
          <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
          <h1 className="sr-only">
            {headingLead} {headingAccent}
          </h1>
          <p aria-hidden className={`${lineClass} text-[8vw] text-white`} style={{ fontSize: '9.4cqw' }}>
            {headingLead}
          </p>
          <p aria-hidden className={`${lineClass} mt-[0.1em] text-[12vw] text-orange`} style={{ fontSize: '15cqw' }}>
            {headingAccent}
          </p>
        </div>
        <div className="svc-stmt-line min-w-0">
          <ServicesHeroLogo size="large" />
        </div>
      </div>
    </section>
  );
}
