'use client';

import { useRef, useEffect, useState, useCallback, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { VideoLightbox } from '@/components/molecules/VideoLightbox';
import { cn } from '@/components/ui/cn';
import { hero } from '@/content/site';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HeroLogo3D = dynamic(
  () => import('@/components/sections/HeroLogo3D').then((m) => m.HeroLogo3D),
  { ssr: false },
);

const HERO_VIDEO_SRC = '/videos/propagenda-marketing.mp4';
const ACCENT_WORD = 'CREATIVITY';

type ClipInset = { t: number; r: number; b: number; l: number; rad: number };

/**
 * Rest clip — centered portrait reel (equal L/R). Wide enough on small screens
 * so it never reads as a hairline; tighter on xl for the classic showreel panel.
 */
const CLIP_REST_NARROW: ClipInset = { t: 10, r: 12, b: 14, l: 12, rad: 18 }; // ~76% centered
const CLIP_REST_MD: ClipInset = { t: 9, r: 20, b: 11, l: 20, rad: 20 }; // ~60% centered
const CLIP_REST_LG: ClipInset = { t: 8, r: 28, b: 10, l: 28, rad: 24 }; // ~44% centered
const CLIP_REST_XL: ClipInset = { t: 8, r: 34, b: 10, l: 34, rad: 24 }; // ~32% centered
const CLIP_WIDE: ClipInset = { t: 0, r: 0, b: 0, l: 0, rad: 0 };

function clipVars(c: ClipInset) {
  return {
    '--clip-t': c.t,
    '--clip-r': c.r,
    '--clip-b': c.b,
    '--clip-l': c.l,
    '--clip-rad': c.rad,
  };
}

const CLIP_PATH_STYLE = {
  clipPath:
    'inset(calc(var(--clip-t) * 1%) calc(var(--clip-r) * 1%) calc(var(--clip-b) * 1%) calc(var(--clip-l) * 1%) round calc(var(--clip-rad) * 1px))',
} as CSSProperties;

const SPREAD = [-120, 150, -170, 130];

export function Hero({ flat = false }: { flat?: boolean }) {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const isMd = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1440px)');
  const [videoOpen, setVideoOpen] = useState(false);

  const clipRest = isXl
    ? CLIP_REST_XL
    : isDesktop
      ? CLIP_REST_LG
      : isMd
        ? CLIP_REST_MD
        : CLIP_REST_NARROW;

  const closeVideo = useCallback(() => setVideoOpen(false), []);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;
    if (videoOpen) {
      el.pause();
    } else {
      void el.play().catch(() => {});
    }
  }, [videoOpen]);

  useEffect(() => {
    // `flat` (embedded /preview): no pin / scroll-scrub — render the hero as a static
    // single viewport so the minified home scrolls normally inside the device iframe.
    if (reducedMotion || flat || !pinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-headline', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' });
      gsap.from('.hero-meta', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        delay: 0.4,
        stagger: 0.12,
        ease: 'power2.out',
      });

      gsap.set('.hero-word', { xPercent: 0, yPercent: 0, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=190%',
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });
      gsap.set(videoRef.current, clipVars(clipRest));
      tl.fromTo(
        videoRef.current,
        clipVars(clipRest),
        { ...clipVars(CLIP_WIDE), ease: 'power2.inOut', duration: 0.72, immediateRender: false },
        0,
      )
        .fromTo(
          '.hero-meta',
          { opacity: 1, yPercent: 0 },
          { opacity: 0, yPercent: -30, ease: 'none', duration: 0.3, immediateRender: false },
          0,
        )
        .fromTo(
          '.hero-word',
          { xPercent: 0, yPercent: 0, opacity: 1 },
          {
            xPercent: (i: number) => SPREAD[i] ?? (i % 2 ? 140 : -140),
            yPercent: (i: number) => (i % 2 ? 30 : -30),
            opacity: 0,
            ease: 'power2.in',
            duration: 0.46,
            stagger: 0.04,
            immediateRender: false,
          },
          0.52,
        );

      if (pinRef.current?.querySelector('.hero-3d')) {
        gsap.set('.hero-3d', { opacity: 1 });
        tl.fromTo(
          '.hero-3d',
          { opacity: 1 },
          { opacity: 0, ease: 'none', duration: 0.28, immediateRender: false },
          0,
        );
      }
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion, isDesktop, clipRest, flat]);

  const words = hero.h1.split(' ');
  const subParts = hero.subtitle.split('360°');

  return (
    <section ref={containerRef} data-seamless-act className={cn('relative', flat ? 'h-screen' : 'h-[290vh]')}>
      <div ref={pinRef} className="relative h-screen overflow-hidden bg-charcoal">
        {/* Flat ground — the reel and the sentence are the only protagonists here. */}
        <div className="absolute inset-0 isolate">
          <div
            ref={videoRef}
            className="absolute inset-0"
            style={{ ...CLIP_PATH_STYLE, ...clipVars(clipRest) }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-charcoal to-black">
              <BrandPattern variant="tiled" id="hero-video" />
            </div>
            <video
              ref={videoElRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
            {/* Scrim — keeps the left headline readable over the centered reel. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/35 to-charcoal/20"
            />
            {/* Gloss — specular sheen + rim catch so the clipped panel reads as polished glass. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_18%,transparent_42%)]" />
              <div className="absolute inset-x-[12%] top-0 h-[42%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.18),transparent_70%)]" />
              <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.06),inset_1px_0_0_rgba(255,255,255,0.1),inset_-1px_0_0_rgba(255,255,255,0.04)]" />
              <div className="absolute inset-x-[18%] bottom-[8%] h-[28%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.07),transparent_72%)]" />
            </div>
            {/* Centered in the clipped panel (tracks clip as it expands). */}
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center group/play">
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className={cn(
                  'transition-hover flex h-14 w-14 items-center justify-center rounded-full',
                  'border border-white/25 bg-transparent text-white',
                  'opacity-0 scale-95 touch-coarse:opacity-90',
                  'group-hover/play:opacity-100 group-hover/play:scale-100',
                  'group-focus-within/play:opacity-100 group-focus-within/play:scale-100',
                  'hover-fine:hover:border-white/50 hover-fine:hover:bg-white/5',
                  'focus-visible:opacity-100 focus-visible:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
                )}
                aria-label="Play showreel fullscreen"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </button>
            </div>
          </div>

          {isDesktop && !flat ? (
            /* Demoted to supporting cast: smaller, pushed right so it clears the reel panel —
               the reel and the sentence are the hero's two speakers, the mark is the signature.
               Skipped in `flat` (embedded preview) — the WebGL canvas is heavy and the mini
               frame doesn't need it. */
            <div className="hero-3d pointer-events-none absolute inset-0 -translate-y-[5vh] translate-x-[7vw] scale-[0.82]">
              <HeroLogo3D className="absolute inset-0" />
            </div>
          ) : null}

          {/* Headline left; subtitle + CTA centered on the full viewport width. */}
          <div className="pointer-events-none relative z-content flex h-full flex-col justify-center px-gutter-m pb-16 pt-28 lg:-translate-y-[5vh] lg:px-gutter-d">
            <h1 className="hero-headline mt-6 max-w-[11ch] self-start font-sans text-[clamp(2.15rem,10.5vw,7.5rem)] font-bold uppercase leading-[0.92] tracking-display text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.75),0_0_48px_rgba(37,37,37,0.85)] sm:mt-8 sm:max-w-[13ch] lg:mt-16 lg:max-w-[15ch] lg:leading-[0.95]">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={cn(
                    'hero-word block will-change-transform',
                    word === ACCENT_WORD && 'accent-word',
                  )}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-5 flex max-w-[22ch] flex-col items-start text-left sm:max-w-none">
              <p className="hero-meta text-xs font-bold uppercase leading-snug tracking-[0.14em] text-white sm:whitespace-nowrap sm:text-sm sm:tracking-[0.16em]">
                {subParts[0]}
                <span className="inline-block align-middle text-base font-extrabold text-orange motion-safe:animate-hero-360 sm:text-lg">
                  360&deg;
                </span>
                {subParts[1]}
              </p>
              <div className="hero-meta pointer-events-auto mt-5">
                <Button href={hero.cta.href} size="lg">
                  {hero.cta.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoLightbox
        isOpen={videoOpen}
        onClose={closeVideo}
        video={{
          src: HERO_VIDEO_SRC,
          width: 1080,
          height: 1920,
          title: 'Propagenda showreel',
        }}
      />
    </section>
  );
}
