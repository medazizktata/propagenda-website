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

      <div className="relative z-content grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
          <h1
            className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(2.2rem, 5.6vw, 4.75rem)' }}
          >
            <span className="svc-stmt-line block">The whole brand,</span>
            <span className="svc-stmt-line block text-orange">one studio.</span>
          </h1>
          <p className="svc-stmt-line mt-7 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
            Eight integrated capabilities &mdash; from the first logo to the full launch, and
            everything that carries your brand in between.
          </p>
        </div>

        {/* Hero visual — the brand monogram (glow render). Not reused in the index below. */}
        <div className="svc-stmt-line order-1 lg:order-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 sm:aspect-[16/9] lg:aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/monogram-glow.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
