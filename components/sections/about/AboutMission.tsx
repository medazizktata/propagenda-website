'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 2 — The mission. The real positioning statement set large and editorial, fully legible
 * from the first frame. Every word renders white (the anchor phrase "grow and succeed" in
 * orange) on SSR, with no JS, and under reduced motion.
 *
 * Motion is TRANSLATE-ONLY: as the statement enters, the words settle up into place with a
 * fine stagger. There is no opacity gate and no scroll-pinned scrub, so the copy can never
 * ship dim or blank the way a char-opacity reveal does on a headless first render.
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
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.mission-word', {
        y: 22,
        ease: 'power3.out',
        duration: 0.65,
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-charcoal px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
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
    </section>
  );
}
