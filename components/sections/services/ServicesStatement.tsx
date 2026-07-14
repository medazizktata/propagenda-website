'use client';

import { useEffect, useRef } from 'react';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Act 1 of the Services page — a single-screen value statement that sets the tone before the
 * index. Visible on load (per the brand's motion contract); the lines rise in once as the
 * page arrives, then hold. Draft copy — refine voice before ship.
 */
export function ServicesStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

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
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal px-gutter-m lg:px-gutter-d"
    >
      <div className="pattern-section-fade pointer-events-none absolute inset-0">
        <BrandPattern variant="dense" id="services-statement" half="left" className="opacity-20" />
      </div>

      <div className="relative z-content w-full max-w-5xl">
        <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
        <h1
          className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}
        >
          <span className="svc-stmt-line block">The whole brand,</span>
          <span className="svc-stmt-line block text-orange">one studio.</span>
        </h1>
        <p className="svc-stmt-line mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          Eight integrated capabilities &mdash; from the first logo to the full launch, and
          everything that carries your brand in between.
        </p>
      </div>
    </section>
  );
}
