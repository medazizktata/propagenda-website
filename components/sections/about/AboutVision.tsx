'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 6 — The vision motif. The brand's forward-looking line runs as a full-bleed kinetic
 * marquee (SMV about-popup), fading up as it enters. Reduced motion holds it still and legible.
 */
export function AboutVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { vision } = aboutContent;
  const repeats = Array.from({ length: 4 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('.vision-fade');
      if (reducedMotion) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 78%' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-navy py-24 lg:py-32"
    >
      <p className="vision-fade px-6 text-center text-sm font-medium text-orange sm:px-10 lg:px-16">
        {vision.label}
      </p>

      <div
        aria-hidden
        className="vision-fade relative my-10 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
      >
        <div className="flex w-max animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">
          {[...repeats, ...repeats].map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span
                className="whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-[0.01em] text-white/90"
                style={{ fontSize: 'clamp(2.4rem, 8.5vw, 9rem)' }}
              >
                {vision.motif}
              </span>
              <span
                className="mx-[0.4em] leading-none text-orange"
                style={{ fontSize: 'clamp(2.4rem, 8.5vw, 9rem)' }}
              >
                &bull;
              </span>
            </span>
          ))}
        </div>
      </div>

      <p className="vision-fade mx-auto max-w-2xl px-6 text-center text-lg leading-relaxed text-white/70 sm:px-10 lg:px-16">
        {vision.line}
      </p>
    </section>
  );
}
