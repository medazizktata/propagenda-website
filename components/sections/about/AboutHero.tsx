'use client';

import { useEffect, useRef } from 'react';
import { aboutContent } from '@/content/about';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { WordmarkMorph } from './WordmarkMorph';

/**
 * ACT 1 — The name. A full-bleed type-led manifesto hero. The star is the wordmark morph
 * (propag[A]nda -> propag[E]nda); beneath it the name is decoded as an acronym
 * (PRO + P + AGENDA), then the origin line. The brand pattern drifts behind on scroll.
 */
export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.about-hero-line');

      // Lines are fully legible by default (SSR / no-JS / reduced-motion). Motion only
      // nudges them up on load — TRANSLATE-ONLY, never an opacity gate, so nothing can
      // ship blank if the script or the tween never runs.
      if (reducedMotion) return;

      gsap.from(lines, {
        y: 34,
        ease: 'power3.out',
        duration: 0.9,
        stagger: 0.12,
        delay: 0.35,
      });

      // Pattern parallax + hero content lift as the mission scrolls up over it.
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
        });
      }
      gsap.to('.about-hero-content', {
        yPercent: -12,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const { wordmark, acronym } = aboutContent;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal"
    >
      {/* Brand pattern backdrop — quiet, right-anchored, drifts on scroll. */}
      <div ref={bgRef} aria-hidden className="absolute inset-0 -top-[10%] h-[120%]">
        <div
          className="absolute inset-0 bg-[length:auto_115%] bg-[right_-6vw_center] bg-no-repeat opacity-[0.16] mix-blend-screen"
          style={{ backgroundImage: "url('/images/brand/pattern-field.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/60" />
        <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_30%_40%,transparent_45%,rgba(15,21,31,0.55)_100%)]" />
      </div>

      <div className="about-hero-content relative z-content w-full px-6 pb-16 pt-28 sm:px-10 lg:px-16">
        <p className="about-hero-line mb-6 text-sm font-medium text-orange">About Propagenda</p>

        <h1 aria-label="Propagenda — Professional Planned Agenda">
          <span
            aria-hidden
            className="about-hero-line block font-sans font-extrabold uppercase tracking-[0.01em] text-white [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]"
            style={{ fontSize: 'clamp(2.9rem, 13.5vw, 12rem)', lineHeight: '0.86' }}
          >
            <WordmarkMorph
              prefix={wordmark.prefix}
              from={wordmark.from}
              to={wordmark.to}
              suffix={wordmark.suffix}
            />
          </span>

          {/* The name decoded — PRO + P + AGENDA. */}
          <span
            aria-hidden
            className="about-hero-line mt-6 flex flex-wrap items-baseline gap-x-[0.4em] gap-y-1 font-sans font-bold uppercase leading-[0.95] tracking-[0.04em] text-white/70"
            style={{ fontSize: 'clamp(0.95rem, 2.6vw, 2.05rem)' }}
          >
            {acronym.map((part) => (
              <span key={part.accent}>
                <span className="text-orange">{part.accent}</span>
                {part.tail}
              </span>
            ))}
          </span>
        </h1>

        {/* Signature caption — labels the morph. */}
        <p className="about-hero-line mt-9 font-sans text-lg font-medium text-white sm:text-xl">
          Turn off the <span className="text-white/40 line-through decoration-white/40">A</span>,{' '}
          turn on the <span className="text-orange">E</span>.
        </p>

        <p className="about-hero-line mt-5 max-w-xl text-base leading-relaxed text-white/80">
          {aboutContent.origin}
        </p>
      </div>

      {/* Scroll cue. */}
      <div
        aria-hidden
        className="about-hero-line pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/45"
      >
        <span className="text-xs font-medium">Scroll</span>
        <span className="h-9 w-px bg-gradient-to-b from-orange to-transparent" />
      </div>
    </section>
  );
}
