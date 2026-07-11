'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { useScrollPin } from '@/hooks/useScrollPin';
import { clientLogos } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function ClientLogoGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useScrollPin({
    containerRef,
    pinRef,
    end: '+=250%',
    scrub: 1,
  });

  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(pinRef.current!.querySelectorAll('.client-slot'), {
        opacity: 0,
        scale: 0.9,
        stagger: { each: 0.03, from: 'center', grid: 'auto' },
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-charcoal">
      <div ref={pinRef} className="clients-pin flex h-screen flex-col justify-center px-gutter-m lg:px-gutter-d">
        <DisplayHeading as="h2" size="display-md" ghost className="mb-12">
          Who We Worked With.
        </DisplayHeading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
          {clientLogos.map((name) => (
            <div
              key={name}
              className="client-slot flex aspect-[3/2] items-center justify-center rounded-lg border border-border bg-black/40 p-3 text-center text-xs font-semibold uppercase tracking-wide text-white/80"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
