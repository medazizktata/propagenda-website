'use client';

import { useRef, useEffect, useState, useCallback, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/marketing-button';
import { ScrollCue } from '@/components/molecules/ScrollCue';
import { Hero360Mark } from '@/components/molecules/Hero360Mark';
import { VideoLightbox } from '@/components/molecules/VideoLightbox';
import { cn } from '@/components/ui/cn';
import { hero } from '@/content/site';
import { isFeatureUnlocked } from '@/lib/featureFlags';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useInitLoader } from '@/hooks/useInitLoader';

const HeroLogo3D = dynamic(
  () => import('@/components/sections/HeroLogo3D').then((m) => m.HeroLogo3D),
  { ssr: false },
);

/** Fullscreen master (3840x2160) — lightbox only; far too heavy to seek per frame. */
const HERO_VIDEO_SRC = '/videos/propagenda-marketing.mp4';
/**
 * Scrub proxy — same reel at 1920x1080, no B-frames, keyframe every 5 frames (0.2s).
 * Seeking the 4K master measures ~34ms per frame, which blows the 16.7ms frame budget
 * and makes the scrub visibly stall; this proxy seeks in ~4ms, so scroll stays locked
 * to the picture. Quality loss is invisible while scrubbing — the master still serves
 * the fullscreen lightbox.
 */
const HERO_VIDEO_SCRUB_SRC = '/videos/propagenda-marketing-scrub.mp4';
const HERO_VIDEO_POSTER = '/images/hero-video-poster.jpg';
/** Fallback reel length (s) — replaced by `video.duration` once metadata loads. */
const HERO_VIDEO_SCRUB_END_FALLBACK = 27.44;
/** Opening frames are black; scrub range starts here so scroll reveals visible content. */
const HERO_VIDEO_SCRUB_START = 0.5;
/** Clip expand finishes early; remaining pin scroll scrubs through the full reel. */
const CLIP_EXPAND_RATIO = 0.28;
/** Pinned scroll (% of viewport) for the fallback reel length — scaled when metadata loads. */
const HERO_PIN_BASE_PERCENT = 480;
/** Half a frame at 25fps — below this a reseek would land on the frame already shown. */
const SEEK_EPSILON = 1 / 50;

function pinPercentForDuration(duration: number) {
  const span = Math.max(0.05, duration - HERO_VIDEO_SCRUB_START);
  const fallbackSpan = HERO_VIDEO_SCRUB_END_FALLBACK - HERO_VIDEO_SCRUB_START;
  return Math.round(HERO_PIN_BASE_PERCENT * (span / fallbackSpan));
}

function heroSectionHeightVh(pinPercent: number) {
  return 100 + pinPercent;
}
const ACCENT_WORD = 'CREATIVITY';

function scrollProgressToScrub(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

function scrubToVideoTime(scrub: number, duration = HERO_VIDEO_SCRUB_END_FALLBACK) {
  const end = Math.max(HERO_VIDEO_SCRUB_START + 0.05, duration);
  const span = end - HERO_VIDEO_SCRUB_START;
  return HERO_VIDEO_SCRUB_START + scrub * span;
}

type ClipInset = { t: number; r: number; b: number; l: number; rad: number };

/**
 * Rest clip — centered portrait reel (equal L/R). Wide enough on small screens
 * so it never reads as a hairline; tighter on xl for the classic showreel panel.
 */
const CLIP_REST_NARROW: ClipInset = { t: 6, r: 6, b: 8, l: 6, rad: 14 }; // ~88% — reel dominates on mobile
const CLIP_REST_MD: ClipInset = { t: 5, r: 12, b: 7, l: 12, rad: 18 }; // ~76%
const CLIP_REST_LG: ClipInset = { t: 4, r: 18, b: 6, l: 18, rad: 22 }; // ~64%
const CLIP_REST_XL: ClipInset = { t: 4, r: 22, b: 6, l: 22, rad: 22 }; // ~56%
/** Scroll progress at which the clip finishes expanding — video scrubs in sync. */
const CLIP_EXPAND_END = CLIP_EXPAND_RATIO;
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

/** Foreground (headline, 3D mark, subtitle, scroll cue) — dissolves from first scroll. */
const DISSOLVE_DURATION = 0.1;

export function Hero({ flat = false }: { flat?: boolean }) {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoInnerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const scrubProgressRef = useRef(0);
  const desiredTimeRef = useRef(HERO_VIDEO_SCRUB_START);
  const videoDurationRef = useRef(HERO_VIDEO_SCRUB_END_FALLBACK);
  const heroScrollEndRef = useRef(0);
  const heroGateOpenRef = useRef(false);
  const [heroPinPercent, setHeroPinPercent] = useState(() =>
    pinPercentForDuration(HERO_VIDEO_SCRUB_END_FALLBACK),
  );
  const [videoReady, setVideoReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMd = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1440px)');
  const [videoOpen, setVideoOpen] = useState(false);
  const { ready: initReady } = useInitLoader();

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
    } else if (reducedMotion || flat) {
      void el.play().catch(() => {});
    } else {
      el.pause();
      // Closing the lightbox: hand the frame back to wherever the scroll now sits.
      desiredTimeRef.current = scrubToVideoTime(scrubProgressRef.current, videoDurationRef.current);
      if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
        el.currentTime = desiredTimeRef.current;
      }
    }
  }, [videoOpen, reducedMotion, flat]);

  useEffect(() => {
    // `flat` (embedded /preview): no pin / scroll-scrub — render the hero as a static
    // single viewport so the minified home scrolls normally inside the device iframe.
    if (reducedMotion || flat || !initReady || !pinRef.current) return;

    // ScrollTrigger only records where the reel *should* be. Assigning currentTime
    // straight from onUpdate (up to 60Hz) queues seeks faster than the decoder retires
    // them, so the picture thrashes and reads as frozen. The rAF pump below owns the
    // actual seek and keeps exactly one in flight.
    const setDesiredTime = (scrub: number) => {
      const el = videoElRef.current;
      if (el && Number.isFinite(el.duration) && el.duration > 0) {
        videoDurationRef.current = el.duration;
      }
      desiredTimeRef.current = scrubToVideoTime(scrub, videoDurationRef.current);
    };

    let rafId = requestAnimationFrame(function pumpSeek() {
      rafId = requestAnimationFrame(pumpSeek);
      const el = videoElRef.current;
      if (!el || el.seeking || el.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const target = desiredTimeRef.current;
      if (Math.abs(el.currentTime - target) > SEEK_EPSILON) el.currentTime = target;
    });

    const video = videoElRef.current;
    const onMeta = () => {
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        videoDurationRef.current = video.duration;
        setHeroPinPercent(pinPercentForDuration(video.duration));
      }
      setDesiredTime(scrubProgressRef.current);
    };
    video?.addEventListener('loadedmetadata', onMeta);
    if (video && video.readyState >= HTMLMediaElement.HAVE_METADATA) onMeta();

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

      gsap.set('.hero-word', { opacity: 1 });

      gsap.set('.hero-dissolve', { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set('.hero-scrim', { opacity: 1 });
      // autoAlpha, not opacity: the control must not be a hidden click target at rest.
      gsap.set('.hero-fullscreen-btn', { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${heroPinPercent}%`,
          scrub: 0.45,
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const scrubT = scrollProgressToScrub(self.progress);
            scrubProgressRef.current = scrubT;
            heroScrollEndRef.current = self.end;
            heroGateOpenRef.current = self.progress >= 0.999;
            setDesiredTime(scrubT);
          },
        },
      });
      gsap.set(videoRef.current, clipVars(clipRest));
      gsap.set(videoInnerRef.current, { scale: 1.14, transformOrigin: '50% 50%' });
      // A scrubbed timeline maps scroll progress 0->1 across its *whole* duration, so a
      // tween's duration is only a fraction of the pin if the timeline is a known length.
      // This empty tween fixes that length at 1, making every duration below read
      // literally as "this fraction of the pin". Without it the longest tween defined the
      // duration and every 'early phase' stretched across the entire scroll.
      tl.to({}, { duration: 1 }, 0);
      tl.fromTo(
        videoRef.current,
        clipVars(clipRest),
        { ...clipVars(CLIP_WIDE), ease: 'power2.inOut', duration: CLIP_EXPAND_END, immediateRender: false },
        0,
      )
        .fromTo(
          videoInnerRef.current,
          { scale: 1.14 },
          { scale: 1, ease: 'power2.out', duration: CLIP_EXPAND_END, immediateRender: false },
          0,
        )
        .fromTo(
          '.hero-vignette',
          { opacity: 1 },
          { opacity: 0, ease: 'power1.out', duration: CLIP_EXPAND_END * 0.85, immediateRender: false },
          0,
        )
        .fromTo(
          '.hero-dissolve',
          { opacity: 1, y: 0, filter: 'blur(0px)' },
          {
            opacity: 0,
            y: -28,
            filter: 'blur(10px)',
            ease: 'power2.inOut',
            duration: DISSOLVE_DURATION,
            immediateRender: false,
          },
          0,
        )
        .fromTo(
          '.hero-scrim',
          { opacity: 1 },
          { opacity: 0, ease: 'power1.out', duration: DISSOLVE_DURATION * 1.6, immediateRender: false },
          0,
        )
        .fromTo(
          '.hero-fullscreen-btn',
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'power1.out', duration: 0.08, immediateRender: false },
          CLIP_EXPAND_END * 0.75,
        );

      ScrollTrigger.refresh();
    }, pinRef);

    return () => {
      cancelAnimationFrame(rafId);
      video?.removeEventListener('loadedmetadata', onMeta);
      ctx.revert();
    };
  }, [reducedMotion, isDesktop, clipRest, flat, initReady, heroPinPercent]);

  useEffect(() => {
    if (reducedMotion || flat || !initReady) return;

    const lenis = window.__lenis;
    if (!lenis) return;

    const clampHeroScroll = () => {
      if (heroGateOpenRef.current) return;
      const max = heroScrollEndRef.current;
      if (max > 0 && lenis.scroll > max + 1) {
        lenis.scrollTo(max, { immediate: true });
      }
    };

    lenis.on('scroll', clampHeroScroll);
    return () => {
      lenis.off('scroll', clampHeroScroll);
    };
  }, [reducedMotion, flat, initReady, heroPinPercent]);

  const words = hero.h1.split(' ');
  const subParts = hero.subtitle.split('360°');

  return (
    <section
      ref={containerRef}
      data-seamless-act
      className={cn('relative', (flat || reducedMotion) && 'min-h-screen')}
      style={
        flat || reducedMotion
          ? undefined
          : { height: `${heroSectionHeightVh(heroPinPercent)}vh` }
      }
    >
      <div
        ref={pinRef}
        className={cn(
          'relative overflow-hidden bg-charcoal',
          flat || reducedMotion ? 'min-h-screen' : 'h-screen',
        )}
      >
        {/* Flat ground — the reel and the sentence are the only protagonists here. In `flat`
            (preview) this layer flows in-document (relative) so the in-flow headline gives the
            panel its height — the video stays an absolute backdrop behind it. */}
        <div className={cn('isolate', flat ? 'relative' : 'absolute inset-0')}>
          <div
            ref={videoRef}
            className="absolute inset-0 z-[1]"
            style={{ ...CLIP_PATH_STYLE, ...clipVars(clipRest) }}
          >
            <div
              aria-hidden
              className={cn(
                'absolute inset-0 bg-charcoal transition-opacity duration-700',
                videoReady ? 'opacity-0' : 'opacity-100',
              )}
            />
            <div ref={videoInnerRef} className="absolute inset-0 z-[1] will-change-transform">
              <video
                ref={videoElRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={HERO_VIDEO_SCRUB_SRC}
                poster={HERO_VIDEO_POSTER}
                autoPlay={reducedMotion || flat}
                muted
                loop={reducedMotion || flat}
                playsInline
                preload="auto"
                aria-hidden
                onLoadedData={() => setVideoReady(true)}
              />
            </div>
            {/* Scrim — heavy on the left for headline legibility; open on the reel. It
                exists only for the headline, so it clears with it rather than dimming the
                full-bleed reel for the rest of the scrub. */}
            <div
              aria-hidden
              className="hero-scrim pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(18,18,18,0.72)_0%,rgba(18,18,18,0.15)_40%,transparent_65%)]"
            />
            <div
              aria-hidden
              className="hero-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(0,0,0,0.35)_100%)]"
            />
            {/* Gloss — specular sheen + rim catch so the clipped panel reads as polished glass. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_18%,transparent_42%)]" />
              <div className="absolute inset-x-[12%] top-0 h-[42%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.18),transparent_70%)]" />
              <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.06),inset_1px_0_0_rgba(255,255,255,0.1),inset_-1px_0_0_rgba(255,255,255,0.04)]" />
              <div className="absolute inset-x-[18%] bottom-[8%] h-[28%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.07),transparent_72%)]" />
            </div>
          </div>

          {isDesktop && !flat ? (
            <div className="hero-dissolve hero-3d pointer-events-none absolute inset-0 z-[2] -translate-y-[5vh] translate-x-[7vw] scale-[0.82] will-change-[opacity,transform,filter]">
              <HeroLogo3D className="absolute inset-0" />
            </div>
          ) : null}

          {/* Headline + subtitle — dissolves with the 3D mark on scroll. */}
          <div
            className={cn(
              'hero-dissolve pointer-events-none relative z-[3] flex flex-col px-gutter-m pb-16 pt-28 will-change-[opacity,transform,filter] lg:px-gutter-d',
              flat ? 'min-h-screen justify-center' : 'h-full justify-center lg:-translate-y-[5vh]',
            )}
          >
            <h1 className="hero-headline mt-6 max-w-[11ch] self-start font-sans text-[clamp(2.15rem,10.5vw,7.5rem)] font-bold uppercase leading-[0.92] tracking-display text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.75),0_0_48px_rgba(37,37,37,0.85)] sm:mt-8 sm:max-w-[13ch] lg:mt-16 lg:max-w-[15ch] lg:leading-[0.95]">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={cn(
                    'hero-word block',
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
                <Hero360Mark />
                {subParts[1]}
              </p>
              {isFeatureUnlocked(hero.cta.href) ? (
                <div className="hero-meta pointer-events-auto mt-5">
                  <Button href={hero.cta.href} size="lg">
                    {hero.cta.label}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>


          {/* Scroll is how the reel plays — a centred play triangle over a still frame is
              the click-to-play cliché this hero avoids. Fullscreen is a quiet corner control
              that fades in only once the reel is full-bleed; it sits outside the clipped
              panel so the clip-path can't crop it, and uses autoAlpha so it is never an
              invisible click target. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] flex justify-start px-gutter-m pb-7 lg:px-gutter-d">
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className={cn(
                'hero-fullscreen-btn transition-hover pointer-events-auto flex items-center gap-2',
                'rounded-full border border-white/20 bg-black/30 px-3.5 py-2 backdrop-blur-sm',
                'text-[10px] font-bold uppercase tracking-[0.16em] text-white/70',
                'hover-fine:hover:border-white/45 hover-fine:hover:text-white',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
                // Scrubbed path only: GSAP fades this in once the reel goes full-bleed, and
                // its inline autoAlpha overrides these classes.
                !flat && !reducedMotion && 'invisible opacity-0',
              )}
              aria-label="Play showreel fullscreen"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
              </svg>
              Fullscreen
            </button>
          </div>

          {!flat && !reducedMotion ? (
            <ScrollCue label="Scroll to explore showreel" className="hero-dissolve hero-scroll-cue opacity-75" />
          ) : null}
        </div>
      </div>

      <VideoLightbox
        isOpen={videoOpen}
        onClose={closeVideo}
        video={{
          src: HERO_VIDEO_SRC,
          width: 3840,
          height: 2160,
          poster: HERO_VIDEO_POSTER,
          title: 'Propagenda showreel',
        }}
      />
    </section>
  );
}
