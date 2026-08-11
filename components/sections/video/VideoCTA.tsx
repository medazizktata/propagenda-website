'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { VideoProject } from '@/types/content';

// Video-oriented CTA: the showreel plays *inside* the words "LET'S ROLL." (SVG mask cuts the type
// out of a charcoal cover so the footage shows only through the letters), with an orange outline
// keeping it legible over any frame. Autoplays muted only while in view; reduced motion holds a
// still frame.
export function VideoCTA({ film, onWatch }: { film: VideoProject; onWatch: () => void }) {
  const bandRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const band = bandRef.current;
    const vid = videoRef.current;
    if (!band || !vid || reducedMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (vid.preload === 'none') vid.preload = 'metadata';
          void vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(band);
    return () => io.disconnect();
  }, [reducedMotion]);

  const textProps = {
    x: 600,
    y: 182,
    textAnchor: 'middle' as const,
    className: 'font-sans',
    style: { fontWeight: 800, fontSize: 176, letterSpacing: '-6px' },
  };

  return (
    <section className="relative overflow-hidden bg-charcoal px-gutter-m pb-28 pt-24 text-center lg:px-gutter-d lg:pb-36 lg:pt-32">
      {/* Warm floor glow — kept clear of the type band so the letter cut-out stays seamless. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[360px] w-[820px] max-w-[120vw] -translate-x-1/2 translate-y-1/3 rounded-full bg-orange/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* REC eyebrow */}
        <div className="mb-9 flex items-center justify-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/50">
          <span className="flex items-center gap-2 text-orange">
            <span className="h-2 w-2 rounded-full bg-orange motion-safe:animate-pulse" />
            Rec
          </span>
          <span aria-hidden className="h-3 w-px bg-white/20" />
          <span>Showreel — 00:27</span>
        </div>

        {/* The words, with the reel playing inside them */}
        <div ref={bandRef} className="relative mx-auto aspect-[1200/240] w-full max-w-5xl">
          <video
            ref={videoRef}
            src={film.src}
            poster={film.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover [filter:contrast(1.15)_saturate(1.3)_brightness(1.04)]"
          />
          <svg
            aria-label="Let's roll."
            role="img"
            viewBox="0 0 1200 240"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <mask id="cta-roll-cut">
                <rect x="-8" y="-8" width="1216" height="256" fill="white" />
                <text {...textProps} fill="black">
                  LET&apos;S ROLL.
                </text>
              </mask>
            </defs>
            {/* Charcoal cover, punched out by the type → footage shows only through the letters.
                Oversized past the viewBox so the video's edges never peek out as a seam. */}
            <rect x="-8" y="-8" width="1216" height="256" fill="#252525" mask="url(#cta-roll-cut)" />
            {/* Dark halo separates the letters from the background; crisp orange defines them. */}
            <text {...textProps} fill="none" stroke="#0a0a0a" strokeWidth={7} opacity={0.55}>
              LET&apos;S ROLL.
            </text>
            <text {...textProps} fill="none" stroke="#f58b27" strokeWidth={2.6}>
              LET&apos;S ROLL.
            </text>
          </svg>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-lg text-white/70 md:text-xl">
          Brand films, social reels, motion — let&rsquo;s make yours.
        </p>

        <div className="mx-auto mt-10 flex w-full max-w-lg flex-col items-stretch justify-center gap-3.5 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-orange px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 ease-out hover-fine:hover:-translate-y-0.5 hover-fine:hover:shadow-[0_16px_44px_-12px_rgba(245,139,39,0.6)]"
          >
            Start a project
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-4 w-4 fill-none stroke-current stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={onWatch}
            className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover-fine:hover:border-orange/60 hover-fine:hover:bg-white/[0.04]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-black transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-3.5 w-3.5 fill-current">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
            Watch the showreel
          </button>
        </div>
      </div>
    </section>
  );
}
