'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 2 — The mission. Pinned manifesto where the real positioning statement resolves out of
 * the dark word-by-word as you scroll (SMV char-opacity reveal), the light landing last on
 * "grow and succeed". Reduced motion renders it fully lit and static.
 */
export function AboutMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const words = useMemo(() => {
    const anchor = aboutContent.missionAnchor;
    const [before = '', after = ''] = aboutContent.mission.split(anchor);
    const split = (text: string, accent: boolean) =>
      text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ({ word, accent }));
    return [...split(before, false), ...split(anchor, true), ...split(after, false)];
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>('.mission-word');
      if (reducedMotion) {
        gsap.set(wordEls, { opacity: 1 });
        return;
      }
      gsap.set(wordEls, { opacity: 0.14 });
      gsap.to(wordEls, {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn('relative bg-charcoal', !reducedMotion && 'h-[220vh]')}
    >
      <div
        className={cn(
          'flex flex-col justify-center px-6 sm:px-10 lg:px-16',
          reducedMotion
            ? 'py-28'
            : 'sticky top-0 h-[100svh] overflow-hidden',
        )}
      >
        <p className="mb-8 text-sm font-medium text-orange">Our mission</p>
        <p
          className="max-w-6xl font-sans font-semibold uppercase tracking-[0.005em] text-white"
          style={{ fontSize: 'clamp(1.5rem, 4.6vw, 3.6rem)', lineHeight: '1.12' }}
        >
          {words.map((item, i) => (
            <span
              key={`${item.word}-${i}`}
              className={cn('mission-word mr-[0.28em] inline-block', item.accent && 'text-orange')}
            >
              {item.word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
