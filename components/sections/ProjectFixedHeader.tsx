'use client';

import { useEffect, useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface ProjectFixedHeaderProps {
  title: string;
}

export function ProjectFixedHeader({ title }: ProjectFixedHeaderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !titleWrapRef.current) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to(titleWrapRef.current, {
        scale: 0.75,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <header
      ref={sectionRef}
      className="pointer-events-none relative z-[2] min-h-[30vh] pt-header"
    >
      <div
        className="absolute inset-x-0 top-0 h-[15vh] bg-gradient-to-b from-black/80 to-transparent"
        aria-hidden
      />
      <div
        ref={titleWrapRef}
        className="origin-top px-gutter-m pt-12 text-center lg:px-[100px]"
      >
        <DisplayHeading as="h1" size="display-sm" className="mx-auto max-w-[90vw]">
          {title}
        </DisplayHeading>
      </div>
    </header>
  );
}
