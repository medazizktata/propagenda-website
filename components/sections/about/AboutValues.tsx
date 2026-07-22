'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * ACT 3 — What we do. One bold creed ("We create, we never copy.") anchors a quiet editorial
 * list of the four core values on the bare field — hairline-divided rows, no cards. Each row
 * brightens and its gloss rises as it crosses into view.
 */
export function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.value-row');
      const quoteWords = gsap.utils.toArray<HTMLElement>('.creed-word');

      if (reducedMotion) {
        gsap.set([...rows, ...quoteWords], { autoAlpha: 1, y: 0 });
        gsap.set(rows.map((r) => r.querySelector('.value-title')), { color: '#ffffff' });
        return;
      }

      gsap.set(quoteWords, { autoAlpha: 0, y: 24 });
      gsap.to(quoteWords, {
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: '.about-creed', start: 'top 78%' },
      });

      rows.forEach((row) => {
        const title = row.querySelector('.value-title');
        const gloss = row.querySelector('.value-gloss');
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%' } });
        tl.fromTo(
          title,
          { color: 'rgba(255,255,255,0.28)', y: 18, autoAlpha: 0 },
          { color: '#ffffff', y: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.7 },
        ).fromTo(
          gloss,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.6 },
          0.15,
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-black px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <p className="text-sm font-medium text-orange">What we do</p>

      <h2
        className="about-creed mt-6 max-w-4xl font-sans font-extrabold uppercase leading-[0.95] tracking-[0.01em] text-white"
        style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}
      >
        <span className="creed-word mr-[0.25em] inline-block">We</span>
        <span className="creed-word mr-[0.25em] inline-block">create,</span>
        <span className="creed-word mr-[0.25em] inline-block">we</span>
        <span className="creed-word mr-[0.25em] inline-block text-orange">never&nbsp;copy.</span>
      </h2>

      <p className="mt-8 max-w-xl text-base leading-relaxed text-white/55">
        Four principles hold under every project, from the first strategy session to launch.
      </p>

      <ul className="mt-14 lg:mt-20">
        {aboutContent.valueDetails.map((value) => (
          <li
            key={value.title}
            className="value-row grid gap-4 border-t border-border py-8 md:grid-cols-[1.1fr_1fr] md:items-baseline md:gap-12 lg:py-10"
          >
            <h3
              className="value-title font-sans font-bold leading-[1.02] text-white"
              style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.9rem)' }}
            >
              {value.title}
            </h3>
            <p className="value-gloss max-w-md text-base leading-relaxed text-white/60 md:text-lg">
              {value.gloss}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
