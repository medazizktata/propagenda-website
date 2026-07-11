'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { WorkCard } from '@/components/sections/WorkCard';
import { featuredWork, moreWork } from '@/content/home';
import { useScrollPin } from '@/hooks/useScrollPin';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function WorkSplitSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useScrollPin({
    containerRef,
    pinRef,
    end: '+=280%',
    scrub: 0.8,
  });

  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(pinRef.current!.querySelectorAll('.work-column'), {
        yPercent: (i) => (i === 0 ? -5 : 5),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 0.8,
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="work-split" ref={containerRef} className="relative h-[280vh] bg-black">
      <div ref={pinRef} className="work-split-pin h-screen px-gutter-m py-20 lg:px-gutter-d">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Our Work</SectionLabel>
            <DisplayHeading as="h2" size="display-xs" className="mt-2">
              Our Design Masterpieces
            </DisplayHeading>
          </div>
          <Button href="/work" variant="primary-ghost">
            View All Portfolio
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="work-column flex flex-col gap-6">
            <DisplayHeading as="p" size="display-xs" className="text-base text-orange">
              Featured Work
            </DisplayHeading>
            {featuredWork.map((item) => (
              <WorkCard key={item.href} {...item} />
            ))}
          </div>
          <div className="work-column flex flex-col gap-6">
            <DisplayHeading as="p" size="display-xs" className="text-base text-orange">
              More Work
            </DisplayHeading>
            {moreWork.map((item) => (
              <WorkCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
