'use client';

import { useRef, useEffect } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { manifestoAttribution, manifestoQuote } from '@/content/home';
import { useScrollPin } from '@/hooks/useScrollPin';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function ManifestoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useScrollPin({
    containerRef,
    pinRef,
    end: '+=260%',
    scrub: 1,
  });

  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pinRef.current!.querySelectorAll('.char'),
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.015,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=260%',
            scrub: 1,
          },
        },
      );
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative h-[260vh] bg-black">
      <div
        ref={pinRef}
        className="manifesto-pin flex h-screen items-center px-gutter-m lg:px-gutter-d"
      >
        <blockquote className="max-w-prose-fixed">
          <DisplayHeading as="p" size="display-sm" ghost className="leading-tight">
            {manifestoQuote.split('').map((char, i) => (
              <span key={i} className="char inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </DisplayHeading>
          <BodyText as="p" size="text-lg" muted className="mt-8">
            — {manifestoAttribution}
          </BodyText>
        </blockquote>
      </div>
    </section>
  );
}
