'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function AboutPopupMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            end: 'bottom 20%',
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y border-border bg-black py-16 opacity-100"
      aria-hidden
    >
      <div className="flex w-max animate-[marquee_40s_linear_infinite]">
        {[0, 1].map((i) => (
          <DisplayHeading key={i} as="p" size="display-lg" ghost className="mx-8 whitespace-nowrap">
            {aboutContent.popupMarquee}
          </DisplayHeading>
        ))}
      </div>
    </div>
  );
}
