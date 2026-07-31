'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { growthStaircase } from '@/content/home';
import { cn } from '@/components/ui/cn';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// Each step is raised above the one before it, so the orange treads climb left → right into a
// staircase — growth reads as literal upward steps. Stacks vertically (no ascent) on mobile.
const RISE = ['md:mt-[9rem]', 'md:mt-[6rem]', 'md:mt-[3rem]', 'md:mt-0'];

export function GrowthStaircase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { label, headingLead, headingAccent, intro, steps } = growthStaircase;

  // Scroll-driven: as the section passes through, each tread DRAWS in and its step CLIMBS up,
  // staggered — the staircase builds under the scroll. No-JS and reduced-motion render the
  // whole staircase in place (legible by default; the animation is pure enhancement).
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(['.gs-head', '.gs-step-body'], { autoAlpha: 1, y: 0 });
        gsap.set('.gs-tread', { scaleX: 1 });
        return;
      }
      gsap.set('.gs-head', { autoAlpha: 0, y: 44 });
      gsap.set('.gs-tread', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.gs-step-body', { autoAlpha: 0, y: 64 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          end: 'top 18%',
          scrub: 0.6,
        },
      });
      tl.to('.gs-head', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.18 }, 0)
        .to('.gs-tread', { scaleX: 1, ease: 'power3.out', duration: 0.5, stagger: 0.22 }, 0.16)
        .to('.gs-step-body', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.44, stagger: 0.22 }, 0.22);
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="growth"
      ref={sectionRef}
      className="relative overflow-hidden bg-charcoal px-gutter-m py-24 lg:px-gutter-d lg:py-32"
    >
      <div aria-hidden className="pattern-section-fade pointer-events-none absolute inset-0">
        <BrandPattern variant="tiled" id="growth" />
      </div>

      <div className="relative z-content mx-auto max-w-7xl">
        <div className="gs-head max-w-2xl will-change-transform">
          <SectionLabel>{label}</SectionLabel>
          <DisplayHeading as="h2" size="display-sm" className="mb-5 mt-4">
            {headingLead} <span className="accent-word">{headingAccent}</span>.
          </DisplayHeading>
          <p className="max-w-lg text-lg leading-relaxed text-white/60">{intro}</p>
        </div>

        {/* Staircase — each block sits on an orange tread and climbs above the previous one. */}
        <ol className="gs-stairs mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-4 md:items-start md:gap-6">
          {steps.map((s, i) => (
            <li key={s.step} className={cn('group relative', RISE[i % RISE.length])}>
              {/* Tread — the orange step surface; draws left→right on scroll. */}
              <div className="gs-tread mb-6 h-1.5 w-full origin-left rounded-full bg-orange will-change-transform" />
              <div className="gs-step-body will-change-transform">
                <p
                  className="font-sans font-black leading-none text-orange"
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
