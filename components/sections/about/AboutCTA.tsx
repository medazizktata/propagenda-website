'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { Button } from '@/components/ui/Button';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 7 — Close. The brand reserves orange as a surface for its call to action. A concise
 * invitation lands on /contact. Content fades up on entry; static under reduced motion.
 */
export function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { cta } = aboutContent;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      // Legible by default; TRANSLATE-ONLY entry so the copy never ships invisible on the
      // orange surface if the trigger doesn't fire.
      gsap.from('.cta-fade', {
        y: 26,
        ease: 'power3.out',
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-orange">
      <BrandPattern variant="tiled" className="!opacity-[0.1] [filter:brightness(0)]" />
      <div className="relative z-content mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="cta-fade text-sm font-semibold text-[#0a0a0a]/75">{cta.kicker}</p>
        <h2
          className="cta-fade font-sans font-extrabold uppercase leading-[0.95] tracking-[0.01em] text-[#0a0a0a]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
        >
          {cta.heading}
        </h2>
        <p className="cta-fade max-w-xl text-lg leading-relaxed text-[#0a0a0a]/85">{cta.body}</p>
        <div className="cta-fade">
          <Button href={cta.href} variant="secondary" size="lg">
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
