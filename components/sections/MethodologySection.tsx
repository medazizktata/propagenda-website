'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { methodologySteps } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// A horizontal timeline: the four steps sit as checkpoints along one line. As you scroll,
// the heading reveals, then the orange line draws left→right, lighting up each checkpoint
// (dot + content) as it arrives. Checkpoints lift/glow on hover. Pinned via a sticky panel
// so the reveal plays in place; stacks vertically on narrow screens.
export function MethodologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(['.mth-head', '.mth-step'], { opacity: 1, y: 0 });
        gsap.set('.mth-fill', { scaleX: 1 });
        return;
      }
      gsap.set('.mth-head', { opacity: 0, y: 50 });
      gsap.set('.mth-step', { opacity: 0, y: 40 });
      gsap.set('.mth-fill', { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // Begin revealing WHILE the section is still scrolling into place (mid-transition)
          // so you never land on a fully-blank, locked timeline waiting to animate.
          start: 'top 75%',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });
      tl
        // Main text reveals first as you scroll in.
        .to('.mth-head', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.1 }, 0)
        // Line draws across the WHOLE scroll and each checkpoint lights up as it arrives, so
        // the last one only lands right at the end (not ~85% of the way through).
        .to('.mth-fill', { scaleX: 1, ease: 'none', duration: 0.98 }, 0.02)
        .to('.mth-step', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.15, stagger: 0.28 }, 0.1);
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="methodology" ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-charcoal px-gutter-m py-24 lg:px-gutter-d">
        <div className="pattern-section-fade pointer-events-none absolute inset-0">
          <BrandPattern variant="tiled" id="methodology" />
        </div>
        <div className="relative z-content w-full">
          <div className="mth-head will-change-transform">
            <SectionLabel>Creative Toolkit</SectionLabel>
            <DisplayHeading as="h2" size="display-sm" className="mb-20 mt-4">
              Our Methodology for <span className="accent-word">Success</span>
            </DisplayHeading>
          </div>

          <div className="relative">
            {/* Base track + orange progress fill, aligned to the dot centres (dot = 14px → 7px). */}
            <div className="absolute inset-x-0 top-[7px] hidden h-px bg-white/15 md:block" />
            <div className="mth-fill absolute inset-x-0 top-[7px] hidden h-px origin-left bg-orange md:block" />

            <ol className="grid grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-8">
              {methodologySteps.map((step) => (
                <li key={step.step} className="mth-step group relative will-change-transform">
                  {/* Dot stays anchored ON the line — it only scales (from its own centre),
                      so growing on hover never nudges it off the track. It is deliberately
                      NOT inside the lifting wrapper below. */}
                  <span className="block h-3.5 w-3.5 origin-center rounded-full bg-orange ring-4 ring-charcoal transition-transform duration-300 ease-out group-hover:scale-[1.7] group-hover:shadow-[0_0_18px_rgba(245,139,39,0.85)]" />
                  {/* Only the text content lifts on hover. */}
                  <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
                    <p className="mt-7 font-sans text-5xl font-black leading-none text-orange">{step.step}</p>
                    <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-orange">
                      {step.label}
                    </h3>
                    <BodyText muted className="mt-2 transition-colors duration-300 group-hover:text-white/85">
                      {step.body}
                    </BodyText>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
