'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 4 — Why us. The brand's core-values line, decomposed into its three pillars
 * (Confidence · Support · Specialized services). Each pillar word ignites orange and its
 * tail rises as the line crosses view; together they reassemble the original sentence.
 */
export function AboutPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.pillar-row');
      if (reducedMotion) {
        rows.forEach((row) => {
          gsap.set(row.querySelector('.pillar-word'), { color: '#f58b27' });
          gsap.set(row.querySelector('.pillar-tail'), { autoAlpha: 1, x: 0 });
        });
        return;
      }
      rows.forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 80%' } });
        tl.fromTo(
          row.querySelector('.pillar-word'),
          { color: 'rgba(255,255,255,0.9)', y: 26, autoAlpha: 0 },
          { color: '#f58b27', y: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.75 },
        ).fromTo(
          row.querySelector('.pillar-tail'),
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, ease: 'power2.out', duration: 0.6 },
          0.2,
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-charcoal px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>

      <div className="relative z-content">
        <p className="text-sm font-medium text-orange">Why us</p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          It comes down to three things we give every brand we work with:
        </p>

        <ul className="mt-14 lg:mt-20">
          {aboutContent.pillarDetails.map((pillar) => (
            <li
              key={pillar.word}
              className="pillar-row flex flex-col gap-1 border-t border-border py-8 md:flex-row md:items-baseline md:gap-10 lg:py-11"
            >
              <span
                className="pillar-word font-sans font-extrabold uppercase leading-[0.92] tracking-[0.01em] text-orange md:basis-[52%]"
                style={{ fontSize: 'clamp(2.1rem, 6.4vw, 5.4rem)' }}
              >
                {pillar.word}
              </span>
              <span className="pillar-tail text-lg leading-snug text-white/75 md:text-2xl">
                {pillar.tail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
