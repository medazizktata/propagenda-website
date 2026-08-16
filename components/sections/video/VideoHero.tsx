'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { VideoProject } from '@/types/content';

// Showreel hero: a silent, looping, edge-to-edge cut that scroll-scales into a takeover; one bold
// line; click plays the full reel with sound. Muted autoplay + poster; reduced-motion shows a still.
export function VideoHero({ showreel, onPlay }: { showreel: VideoProject; onPlay: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.vh-in, .vh-word', { opacity: 1, y: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.vh-word', { yPercent: 115, opacity: 0, duration: 0.75, stagger: 0.09, delay: 0.15 })
        .from('.vh-in', { y: 22, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.4);

      // Scroll-scale takeover: the reel grows and the content lifts away as you scroll off.
      gsap.to(mediaRef.current, {
        scale: 1.14,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.4 },
      });
      gsap.to('.vh-content', {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.4 },
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal"
    >
      <div ref={mediaRef} aria-hidden className="absolute inset-0 will-change-transform">
        <video
          className="h-full w-full object-cover"
          src={showreel.src}
          poster={showreel.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      {/* Scrims for legibility over motion. */}
      <div aria-hidden className="absolute inset-0 bg-charcoal/45" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/55" />

      <div className="vh-content relative z-content w-full px-gutter-m pb-[12vh] pt-40 lg:px-gutter-d">
        <div className="max-w-4xl">
          <span className="vh-in inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">
            <span aria-hidden className="h-[3px] w-9 rounded-full bg-orange" />
            Showreel
          </span>
          <h1
            className="mt-5 font-sans font-bold uppercase leading-[0.9] tracking-display text-white [text-shadow:0_2px_34px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(2.8rem, 9vw, 8rem)' }}
          >
            <span className="block overflow-hidden">
              <span className="vh-word inline-block">We make</span>
            </span>
            <span className="block overflow-hidden">
              <span className="vh-word inline-block">
                it move<span className="text-orange">.</span>
              </span>
            </span>
          </h1>
          <p className="vh-in mt-7 max-w-xl text-base leading-relaxed text-white/80 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] md:text-lg">
            Brand films, social reels, and motion. Propagenda&rsquo;s work, cut to move.
          </p>
          <div className="vh-in mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex items-center gap-3 rounded-full bg-orange px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform duration-300 ease-out hover-fine:hover:-translate-y-0.5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15">
                <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-3.5 w-3.5 fill-current">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
              Watch the showreel
            </button>
            <Link
              href="/contact"
              className="text-sm font-bold uppercase tracking-wider text-white/70 underline-offset-[6px] transition-hover hover-fine:hover:text-orange hover-fine:hover:underline"
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="vh-in absolute bottom-8 right-6 z-content hidden items-center gap-2 text-xs text-white/45 transition-colors hover-fine:hover:text-orange lg:right-12 lg:flex"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
          <path d="m22 9-6 6M16 9l6 6" strokeLinecap="round" />
        </svg>
        Muted. Press play for sound
      </button>
    </section>
  );
}
