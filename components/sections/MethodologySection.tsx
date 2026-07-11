'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { methodologySteps } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function MethodologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll('.methodology-card'), {
        rotate: -30,
        opacity: 0,
        y: 60,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="methodology"
      ref={sectionRef}
      className="relative bg-charcoal px-gutter-m py-32 lg:px-gutter-d"
    >
      <SectionLabel>Creative Toolkit</SectionLabel>
      <DisplayHeading as="h2" size="display-xs" className="mb-16 mt-4">
        Our Methodology for Success
      </DisplayHeading>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {methodologySteps.map((step) => (
          <article
            key={step.step}
            className="methodology-card rounded-lg border border-border bg-navy/60 p-6"
          >
            <p className="text-4xl font-bold text-orange">{step.step}</p>
            <DisplayHeading as="h3" size="display-xs" className="mt-4 text-xl">
              {step.label}
            </DisplayHeading>
            <BodyText muted className="mt-3">
              {step.body}
            </BodyText>
          </article>
        ))}
      </div>
    </section>
  );
}
