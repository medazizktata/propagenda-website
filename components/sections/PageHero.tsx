'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  ghost?: boolean;
  fixed?: boolean;
}

export function PageHero({ title, subtitle, ghost = true, fixed = false }: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll('[data-hero-animate]'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });

      if (fixed && titleWrapRef.current) {
        gsap.to(titleWrapRef.current, {
          scale: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=40%',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [fixed, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative overflow-hidden px-gutter-m py-24 text-center lg:px-gutter-d lg:py-32',
        fixed && 'min-h-[45vh]',
      )}
    >
      {ghost && (
        <DisplayHeading
          as="p"
          size="display-md"
          ghost
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none opacity-40"
        >
          {title}
        </DisplayHeading>
      )}
      <div ref={titleWrapRef} data-hero-animate className="relative z-10">
        <DisplayHeading as="h1" size="display-md" className="mx-auto max-w-[90vw]">
          {title}
        </DisplayHeading>
      </div>
      {subtitle && (
        <BodyText data-hero-animate muted className="relative z-10 mx-auto mt-6 max-w-prose-fixed">
          {subtitle}
        </BodyText>
      )}
    </section>
  );
}
