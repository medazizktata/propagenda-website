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
  const { headingLead, headingAccent, body } = servicesBanner;

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

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[min(100svh,920px)] items-center overflow-hidden bg-charcoal"
    >
      <div className="svc-hero-content relative z-content mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-gutter-m py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.1fr)] lg:gap-16 lg:px-gutter-d lg:py-28">
        <div className="max-w-2xl">
          <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
          <h1
            className="font-sans font-bold uppercase leading-[0.92] tracking-display text-white"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 6.5rem)' }}
          >
            <span className="svc-stmt-line block">{headingLead}</span>
            <span className="svc-stmt-line block text-orange">{headingAccent}</span>
          </h1>
          <p className="svc-stmt-line mt-8 max-w-sm text-base leading-relaxed text-white/70 md:text-lg">
            {body}
          </p>
        </div>

        <div className="svc-stmt-line lg:justify-self-end">
          <ServicesHeroLogo />
        </div>
      </div>
    </section>
  );
}
