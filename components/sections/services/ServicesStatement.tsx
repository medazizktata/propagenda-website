'use client';

import { useEffect, useRef } from 'react';
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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal"
    >
      {/* Full-bleed brand monogram — the hero IS the mark. Not reused in the index below. */}
      <div className="hero-media absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/monogram-glow.jpg"
          alt=""
          className="h-full w-full object-cover object-[68%_center] lg:object-center"
        />
        {/* Fade the mark into charcoal on the left (under the text) and along the floor. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/10 md:via-charcoal/55 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
      </div>

      <div className="relative z-content w-full px-gutter-m lg:px-gutter-d">
        <div className="max-w-2xl">
          <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
          <h1
            className="font-sans font-bold uppercase leading-[0.92] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
          >
            <span className="svc-stmt-line block">The whole brand,</span>
            <span className="svc-stmt-line block text-orange">one studio.</span>
          </h1>
          <p className="svc-stmt-line mt-8 max-w-md text-base leading-relaxed text-white/75 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] md:text-lg">
            Eight integrated capabilities &mdash; from the first logo to the full launch, and
            everything that carries your brand in between.
          </p>
        </div>
      </div>
    </section>
  );
}
