'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function AboutStatement() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={ref} className="px-gutter-m py-32 text-center lg:px-gutter-d">
      <DisplayHeading as="h1" size="display-sm" data-reveal className="mx-auto max-w-[90vw]">
        {aboutContent.h1}
      </DisplayHeading>
      <DisplayHeading as="p" size="display-xs" ghost data-reveal className="mt-8">
        {aboutContent.hook}
      </DisplayHeading>
      <BodyText data-reveal muted className="mx-auto mt-8 max-w-prose-fixed">
        {aboutContent.origin}
      </BodyText>
      <BodyText data-reveal className="mx-auto mt-6 max-w-prose-fixed">
        {aboutContent.mission}
      </BodyText>
    </section>
  );
}
