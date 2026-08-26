'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { growthStaircase } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function GrowthStaircase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { label, headingLead, headingAccent, intro, steps } = growthStaircase;

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.gs-head', {
        y: 36,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.gs-stairs',
          start: 'top 74%',
          toggleActions: 'play none none reverse',
        },
      });
      tl.from('.gs-tread', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.16,
      }).from(
        '.gs-step-body',
        { autoAlpha: 0, y: 28, duration: 0.55, ease: 'power3.out', stagger: 0.12 },
        0.1,
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="growth"
      ref={sectionRef}
      className="relative overflow-hidden bg-charcoal px-gutter-m py-24 lg:px-gutter-d lg:py-32"
    >
      <div className="relative z-content mx-auto max-w-7xl">
        <div className="gs-head max-w-2xl will-change-transform">
          <SectionLabel>{label}</SectionLabel>
          <DisplayHeading as="h2" size="display-sm" className="mb-5 mt-4">
            {headingLead} <span className="accent-word">{headingAccent}</span>.
          </DisplayHeading>
          <p className="max-w-lg text-lg leading-relaxed text-white/60">{intro}</p>
        </div>

        <ol className="gs-stairs mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-4 md:items-start md:gap-8">
          {steps.map((s) => (
            <li key={s.step} className="group relative">
              <div className="gs-tread mb-6 h-1.5 w-full origin-left rounded-full bg-orange will-change-transform" />
              <div className="gs-step-body will-change-transform">
                <p
                  className="font-sans font-extrabold leading-none text-orange"
                  style={{ fontSize: 'clamp(2.75rem, 4.5vw, 4rem)' }}
                >
                  {s.step}
                </p>
                <h3 className="mt-4 font-sans text-xl font-bold uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-orange md:text-2xl">
                  {s.label}
                </h3>
                <p className="mt-3 max-w-xs text-base leading-relaxed text-white/65 transition-colors duration-300 group-hover:text-white/85">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
