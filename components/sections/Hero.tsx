'use client';

import { useRef, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { Button } from '@/components/ui/Button';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { hero } from '@/content/site';
import { useScrollPin } from '@/hooks/useScrollPin';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { splitIntoChars } from '@/lib/motion/splitText';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useScrollPin({
    containerRef,
    pinRef,
    end: '+=250%',
    scrub: 0.5,
  });

  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const letters = pinRef.current!.querySelectorAll('.hero-letter');
      gsap.from(letters, {
        yPercent: 105,
        stagger: 0.02,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 0.5,
        },
      });

      gsap.from(introRef.current, {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 0.5,
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative h-[250vh]">
      <div ref={pinRef} className="hero-pin relative flex h-screen flex-col justify-between overflow-hidden px-gutter-m pb-12 pt-28 lg:px-gutter-d">
        <div className="absolute inset-0 -z-10 opacity-30">
          <MediaPlaceholder label="Hero" className="h-full w-full" accent="from-black via-navy to-charcoal" />
        </div>
        <Logo />
        <div ref={introRef} className="intro-fade max-w-[90vw]">
          <DisplayHeading as="h1" size="display-lg" className="mb-6 overflow-hidden">
            {splitIntoChars(hero.h1, 'hero-letter inline-block')}
          </DisplayHeading>
          <BodyText size="text-xl" className="mb-8 max-w-prose-fixed uppercase tracking-wide">
            {hero.subtitle}
          </BodyText>
          <Button href={hero.cta.href} size="lg">
            {hero.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
