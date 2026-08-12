'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { VideoProject } from '@/types/content';

// End-card CTA: full-viewport showreel punched through giant type. Video + SVG mask share
// one absolute stage (no aspect-strip seam). Thin orange outline only — a heavy stroke reads
// as a fake rule under the baseline. Autoplays muted while in view.
export function VideoCTA({ film, onWatch }: { film: VideoProject; onWatch: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [timecode, setTimecode] = useState('00:00');
  const maskId = `cta-roll-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const section = sectionRef.current;
    const vid = videoRef.current;
    if (!section || !vid || reducedMotion) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (vid.preload === 'none') vid.preload = 'metadata';
          void vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(section);

    const onTime = () => {
      const t = Math.floor(vid.currentTime || 0);
      setTimecode(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
    };
    vid.addEventListener('timeupdate', onTime);

    return () => {
      io.disconnect();
      vid.removeEventListener('timeupdate', onTime);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.vc-in', { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        '.vc-in',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 72%', once: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  const textProps = {
    x: 600,
    y: 430,
    textAnchor: 'middle' as const,
    style: {
      fontWeight: 800,
      fontSize: 152,
      letterSpacing: '-6px',
      fontFamily: 'var(--font-poppins), system-ui, sans-serif',
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92svh] flex-col overflow-hidden bg-black"
    >
      <div aria-hidden className="absolute inset-0">
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover [filter:contrast(1.25)_saturate(1.5)_brightness(1.28)]"
        />
        {/* Warmth through the letter windows when the cut goes dark. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,139,39,0.28)_0%,transparent_58%)]" />
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <rect width="1200" height="800" fill="#fff" />
              <text {...textProps} fill="#000">
                LET&apos;S ROLL.
              </text>
            </mask>
          </defs>
          <rect width="1200" height="800" fill="#000" mask={`url(#${maskId})`} />
          <text {...textProps} fill="none" stroke="#f58b27" strokeWidth={1.8}>
            LET&apos;S ROLL.
          </text>
        </svg>
      </div>

      <div className="relative z-content mx-auto flex w-full max-w-6xl flex-1 flex-col px-gutter-m py-10 lg:px-gutter-d lg:py-14">
        <div className="vc-in flex items-start justify-between gap-6 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/45">
          <span>
            Propagenda <span className="text-orange">Film</span>
          </span>
          <span className="flex items-center gap-2 tabular-nums text-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange motion-safe:animate-pulse" />
            {timecode}
            <span className="text-white/35">/ {film.duration ?? '0:27'}</span>
          </span>
        </div>

        <div className="flex-1" aria-hidden />

        <h2 className="sr-only">Let&apos;s roll.</h2>

        <div>
          <p className="vc-in mx-auto max-w-md text-center text-base leading-relaxed text-white/70 md:text-lg">
            Brand films, social reels, motion — let&rsquo;s make yours.
          </p>

          <div className="vc-in mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-orange px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform duration-300 ease-out hover-fine:hover:-translate-y-0.5"
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
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover-fine:hover:border-orange/60 hover-fine:hover:bg-white/[0.04]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange text-black transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-3.5 w-3.5 fill-current">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
              Watch the showreel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
