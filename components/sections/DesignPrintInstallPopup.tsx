'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { designPrintInstall } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function DesignPrintInstallPopup() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#methodology',
            start: 'top 60%',
            end: '#work-split',
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[4] flex flex-col items-center justify-center opacity-0"
      aria-hidden
    >
      <DisplayHeading as="p" size="display-2xl" ghost className="text-center">
        {designPrintInstall.headline}
      </DisplayHeading>
      <BodyText as="p" size="text-lg" muted className="mt-4 uppercase tracking-wider">
        {designPrintInstall.subline}
      </BodyText>
    </div>
  );
}
