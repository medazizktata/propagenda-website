'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { AppLink } from '@/components/ui/Link';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 5 — Leadership. Asymmetric editorial split: a brand-graded portrait panel (a single
 * surface — monogram over the pattern, standing in until a photo is supplied) against the
 * founder's name and bio. Text rises on entry; the panel drifts on scroll.
 */
export function AboutLeadership() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { leadership } = aboutContent;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.lead-line');
      if (reducedMotion) {
        gsap.set(lines, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        lines,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power3.out',
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 72%' },
        },
      );
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-black px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:items-center lg:gap-20">
        {/* Brand-graded portrait panel — one surface. */}
        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg border border-border bg-navy">
          <div
            ref={portraitRef}
            aria-hidden
            className="absolute inset-0 -top-[8%] h-[116%] bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: "url('/images/brand/pattern-field.png')" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-navy/40 to-transparent" />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-sans font-extrabold uppercase tracking-tighter text-orange/90"
            style={{ fontSize: 'clamp(6rem, 22vw, 12rem)', textShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
          >
            {leadership.initials}
          </span>
          <span className="absolute bottom-5 left-5 font-sans text-sm font-semibold text-white/80">
            {leadership.name}
          </span>
        </div>

        {/* Bio column. */}
        <div>
          <p className="lead-line text-sm font-medium text-orange">Leadership</p>
          <h2
            className="lead-line mt-5 font-sans font-extrabold uppercase leading-[0.92] tracking-[0.01em] text-white"
            style={{ fontSize: 'clamp(2.3rem, 5.6vw, 4.6rem)' }}
          >
            {leadership.name}
          </h2>
          <p className="lead-line mt-4 font-sans text-lg font-semibold text-orange">
            {leadership.title}
          </p>
          <p className="lead-line mt-7 max-w-xl text-lg leading-relaxed text-white/70">
            {leadership.bio}
          </p>
          <p className="lead-line mt-7">
            <AppLink href={leadership.social} external variant="inline" className="text-white/70">
              {leadership.handle}
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  );
}
