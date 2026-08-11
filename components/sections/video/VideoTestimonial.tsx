'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// Oversized editorial pull-quote — a single client voice, given the whole stage.
export function VideoTestimonial({ text, author }: { text: string; author: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.vt-reveal', { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.utils.toArray<HTMLElement>('.vt-reveal').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-charcoal px-gutter-m py-24 lg:px-gutter-d lg:py-32">
      <figure className="mx-auto max-w-4xl">
        <svg
          aria-hidden
          viewBox="0 0 48 34"
          className="vt-reveal h-9 w-14 fill-orange"
        >
          <path d="M0 34V19C0 8.5 6.5 1.5 17 0l1.6 5.2C11.8 6.4 8.4 9.6 8 15h7.4v19H0zM26 34V19C26 8.5 32.5 1.5 43 0l1.6 5.2C37.8 6.4 34.4 9.6 34 15h7.4v19H26z" />
        </svg>
        <blockquote
          className="vt-reveal mt-6 font-sans font-medium leading-[1.15] tracking-tight text-white"
          style={{ fontSize: 'clamp(1.6rem, 4.4vw, 3.1rem)' }}
        >
          &ldquo;{text}&rdquo;
        </blockquote>
        <figcaption className="vt-reveal mt-8 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-orange" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
            {author}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
