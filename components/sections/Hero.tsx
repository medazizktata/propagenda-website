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

/** Lightbox / non-scrub playback — 2560×1440 (Workers asset limit ≤25 MiB). */
const HERO_VIDEO_SRC = '/videos/propagenda-marketing.mp4';
/**
 * Scrub proxy — same reel, short GOP, seeks in ~4ms so scroll stays locked to the frame.
 * The lightbox still uses the higher-quality master above.
 */
const HERO_VIDEO_SCRUB_SRC = '/videos/propagenda-marketing-scrub.mp4';
const HERO_VIDEO_POSTER = '/images/hero-video-poster.jpg';
/** Opening frames are black; scrub range starts here so scroll reveals visible content. */
const HERO_VIDEO_SCRUB_START = 0.5;
/**
 * Scroll-to-play ends on the kinetic text-wheel beat ("to play ▶ …").
 * The 3-up gallery that follows (~15s+) stays lightbox-only.
 */
const HERO_VIDEO_SCRUB_END = 14.5;
/** Full reel length — pin % scales scrub span against this reference. */
const HERO_VIDEO_FULL_DURATION = 27.44;
/** Clip expand finishes early; remaining pin scroll scrubs through the text-wheel beat. */
const CLIP_EXPAND_RATIO = 0.28;
/** Pinned scroll (% of viewport) for the full-reel reference — scaled to scrub span. */
const HERO_PIN_BASE_PERCENT = 480;
/** Half a frame at 25fps — below this a reseek would land on the frame already shown. */
const SEEK_EPSILON = 1 / 50;
/**
 * Browsers (esp. Chromium/Brave over Workers Range responses) can leave `seeking===true`
 * indefinitely after a cancelled/superseded seek — the frame goes black while GSAP still
 * advances. Retry the latest target after this timeout.
 */
const SEEK_STUCK_MS = 280;
/** If the scrub reel never becomes ready, collapse the pin and open the scroll gate. */
const VIDEO_LOAD_TIMEOUT_MS = 8000;

function scrubSpan() {
  return Math.max(0.05, HERO_VIDEO_SCRUB_END - HERO_VIDEO_SCRUB_START);
}

function pinPercentForScrub() {
  const fullSpan = HERO_VIDEO_FULL_DURATION - HERO_VIDEO_SCRUB_START;
  return Math.round(HERO_PIN_BASE_PERCENT * (scrubSpan() / fullSpan));
}

function heroSectionHeightVh(pinPercent: number) {
  return 100 + pinPercent;
}
const ACCENT_WORD = 'CREATIVITY';

function scrollProgressToScrub(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

function scrubToVideoTime(scrub: number) {
  return HERO_VIDEO_SCRUB_START + scrub * scrubSpan();
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
  const heroScrollEndRef = useRef(0);
  const heroGateOpenRef = useRef(false);
  const [heroPinPercent] = useState(() => pinPercentForScrub());
  const [videoReady, setVideoReady] = useState(false);
  /** Fetch/decode failure — skip pin+scrub so the page scrolls into the next section. */
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMd = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1440px)');
  const [videoOpen, setVideoOpen] = useState(false);
  /**
   * Workers Static Assets ignore HTTP Range (always 200 + full body). Brave/Chromium
   * media stacks often fail to decode/seek that. Buffer the scrub proxy once as a blob
   * so all seeks are local.
   */
  const [scrubSrc, setScrubSrc] = useState<string | null>(null);
  const { ready: initReady } = useInitLoader();
  const noScrub = flat || reducedMotion || videoFailed;

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      try {
        const res = await fetch(HERO_VIDEO_SCRUB_SRC, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`scrub fetch ${res.status}`);
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setScrubSrc(objectUrl);
      } catch {
        if (!cancelled) setVideoFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Client-side bailout: no playable frame in time → don't leave a multi-viewport pin.
  useEffect(() => {
    if (noScrub || videoReady || videoFailed) return;
    const t = window.setTimeout(() => setVideoFailed(true), VIDEO_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [noScrub, videoReady, videoFailed]);

  useEffect(() => {
    if (!videoFailed) return;
    heroGateOpenRef.current = true;
    ScrollTrigger.refresh();
  }, [videoFailed]);

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
    if (!el || !scrubSrc || videoFailed) return;
    if (videoOpen) {
      el.pause();
    } else if (noScrub) {
      void el.play().catch(() => {});
    } else {
      el.pause();
      // Closing the lightbox: hand the frame back to wherever the scroll now sits.
      desiredTimeRef.current = scrubToVideoTime(scrubProgressRef.current);
      if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
        el.currentTime = desiredTimeRef.current;
      }
    }
  }, [videoOpen, noScrub, scrubSrc, videoFailed]);

  useEffect(() => {
    // `flat` (embedded /preview) / reduced-motion / failed reel: no pin / scroll-scrub.
    if (noScrub || !initReady || !scrubSrc || !pinRef.current) return;

    // ScrollTrigger only records where the reel *should* be. Assigning currentTime
    // straight from onUpdate (up to 60Hz) queues seeks faster than the decoder retires
    // them, so the picture thrashes and reads as frozen. The rAF pump below owns the
    // actual seek and keeps exactly one in flight.
    const setDesiredTime = (scrub: number) => {
      desiredTimeRef.current = scrubToVideoTime(scrub);
    };

    let seekStartedAt = 0;
    let rafId = requestAnimationFrame(function pumpSeek() {
      rafId = requestAnimationFrame(pumpSeek);
      const el = videoElRef.current;
      if (!el || el.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const target = desiredTimeRef.current;
      const delta = Math.abs(el.currentTime - target);

      if (el.seeking) {
        if (!seekStartedAt) seekStartedAt = performance.now();
        // Stuck seek → black frame. Force the latest scrub target.
        if (performance.now() - seekStartedAt >= SEEK_STUCK_MS) {
          seekStartedAt = performance.now();
          try {
            el.currentTime = target;
          } catch {
            /* ignore InvalidStateError while the element rebuffers */
          }
        }
        return;
      }

      seekStartedAt = 0;
      if (delta > SEEK_EPSILON) {
        seekStartedAt = performance.now();
        el.currentTime = target;
      }
    });

    const video = videoElRef.current;
    const onMeta = () => {
      setDesiredTime(scrubProgressRef.current);
    };
    const onSeeked = () => {
      seekStartedAt = 0;
      const el = videoElRef.current;
      if (!el || el.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const target = desiredTimeRef.current;
      if (Math.abs(el.currentTime - target) > SEEK_EPSILON) {
        seekStartedAt = performance.now();
        el.currentTime = target;
      }
    };
    video?.addEventListener('loadedmetadata', onMeta);
    video?.addEventListener('seeked', onSeeked);
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

      // Copy dissolves with blur; the WebGL mark is opacity-only — CSS filter on a
      // canvas forces expensive re-raster every scrub frame (stutters on scroll-back).
      gsap.set('.hero-dissolve:not(.hero-3d)', { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set('.hero-3d', { opacity: 1, y: 0 });
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
          '.hero-dissolve:not(.hero-3d)',
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
          '.hero-3d',
          { opacity: 1 },
          {
            opacity: 0,
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
      video?.removeEventListener('seeked', onSeeked);
      ctx.revert();
    };
  }, [noScrub, isDesktop, clipRest, initReady, heroPinPercent, scrubSrc]);

  useEffect(() => {
    if (noScrub || !initReady) return;

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
  }, [noScrub, initReady, heroPinPercent]);

  const words = hero.h1.split(' ');
  const subParts = hero.subtitle.split('360°');

  return (
    <section
      ref={containerRef}
      data-seamless-act
      className={cn('relative', noScrub && 'min-h-screen')}
      style={noScrub ? undefined : { height: `${heroSectionHeightVh(heroPinPercent)}vh` }}
    >
      <div
        ref={pinRef}
        className={cn(
          'relative overflow-hidden bg-charcoal',
          noScrub ? 'min-h-screen' : 'h-screen',
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
                'absolute inset-0 z-[2] bg-charcoal transition-opacity duration-700',
                videoReady ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
            >
              {/* Visible while the blob buffers — <video poster> alone often clears to black
                  in Brave once the element starts loading. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_VIDEO_POSTER}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <div ref={videoInnerRef} className="absolute inset-0 z-[1] will-change-transform">
              {scrubSrc && !videoFailed ? (
                <video
                  ref={videoElRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={scrubSrc}
                  poster={HERO_VIDEO_POSTER}
                  autoPlay={noScrub}
                  muted
                  loop={noScrub}
                  playsInline
                  preload="auto"
                  aria-hidden
                  onLoadedData={(e) => {
                    const el = e.currentTarget;
                    const reveal = () => setVideoReady(true);
                    if (Math.abs(el.currentTime - HERO_VIDEO_SCRUB_START) <= SEEK_EPSILON) {
                      reveal();
                      return;
                    }
                    const onSeeked = () => {
                      el.removeEventListener('seeked', onSeeked);
                      reveal();
                    };
                    el.addEventListener('seeked', onSeeked);
                    try {
                      el.currentTime = HERO_VIDEO_SCRUB_START;
                    } catch {
                      reveal();
                    }
                  }}
                  onError={() => setVideoFailed(true)}
                />
              ) : null}
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
            <div className="pointer-events-none absolute inset-0 z-[2] -translate-y-[8vh] translate-x-[7vw] scale-[0.82]">
              <div className="hero-3d absolute inset-0 will-change-[opacity]">
                <HeroLogo3D className="absolute inset-0" />
              </div>
            </div>
          ) : null}

          {/* Headline + subtitle — dissolves with the 3D mark on scroll. */}
          <div
            className={cn(
              'pointer-events-none relative z-[3] flex flex-col px-gutter-m pb-16 pt-28 lg:px-gutter-d',
              flat ? 'min-h-screen justify-center' : 'h-full justify-center -translate-y-[8vh]',
            )}
          >
            <div className="hero-dissolve flex flex-col will-change-[opacity,transform,filter]">
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
          </div>


          {/* Scroll is how the reel plays — a centred play triangle over a still frame is
              the click-to-play cliché this hero avoids. Fullscreen is a quiet corner control
              that fades in only once the reel is full-bleed; it sits outside the clipped
              panel so the clip-path can't crop it, and uses autoAlpha so it is never an
              invisible click target. */}
          {!videoFailed ? (
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
                  !noScrub && 'invisible opacity-0',
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
          ) : null}

          {!flat && !reducedMotion && !videoFailed ? (
            <ScrollCue label="Scroll to explore showreel" className="hero-dissolve hero-scroll-cue opacity-75" />
          ) : !flat && videoFailed ? (
            <ScrollCue label="Scroll" className="hero-scroll-cue opacity-75" />
          ) : null}
        </div>
      </div>

      <VideoLightbox
        isOpen={videoOpen}
        onClose={closeVideo}
        video={{
          src: HERO_VIDEO_SRC,
          width: 2560,
          height: 1440,
          poster: HERO_VIDEO_POSTER,
          title: 'Propagenda showreel',
        }}
      />
    </section>
  );
}
