'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { cn } from '@/components/ui/cn';
import { hero } from '@/content/site';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Desktop only — never mount/fetch Three on tablet and below (lg-max ≤1023px).
const HeroLogo3D = dynamic(
  () => import('@/components/sections/HeroLogo3D').then((m) => m.HeroLogo3D),
  { ssr: false },
);

// The brand's "one word in orange" device (PDF p.1/24, Instagram).
const ACCENT_WORD = 'CREATIVITY';

// Rest state: a centered VERTICAL video panel (~26vw wide, ~88vh tall), matching SMV.
// The scroll effect expands WIDTH ONLY — the 6% top/bottom inset is held for the whole
// tween, so the panel's height never changes (no snap). It widens smoothly to a full-width
// cinematic band rather than popping to full-bleed at the end.
const CLIP_REST = 'inset(14% 37% 4% 37% round 24px)';
const CLIP_WIDE = 'inset(14% 0% 4% 0% round 16px)'; // full width, SAME height as rest

// Per-word horizontal throw on scroll-away (SMV type-parallax), % of container width.
// Large, divergent throws so the words fly right out of the frame as the video takes over.
const SPREAD = [-120, 150, -170, 130];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Mouse parallax on the section pattern (in sync with the 3D logo's mouse-follow).
  useEffect(() => {
    if (reducedMotion || !patternRef.current) return;
    const el = patternRef.current;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      el.style.transform = `translate3d(${cur.x * 34}px, ${cur.y * 34}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const ctx = gsap.context(() => {
      // One-shot intro on mount (resting state is fully visible). Fades the whole headline
      // WRAPPER in — deliberately NOT the .hero-word spans, so it never fights the scrubbed
      // outro tween over the same transforms (which was stranding words off-screen/faded).
      gsap.from('.hero-headline', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' });
      gsap.from('.hero-meta', { opacity: 0, y: 24, duration: 0.6, delay: 0.4, stagger: 0.12, ease: 'power2.out' });

      // Seed EVERY word's rest state deterministically. A staggered fromTo with the default
      // immediateRender only reliably seeds its first target, leaving the rest stranded at
      // their end-state on first paint (words 2–4 flung off / invisible). The gsap.set owns
      // the rest state; the outro tween below is immediateRender:false so it can't re-break it.
      gsap.set('.hero-word', { xPercent: 0, yPercent: 0, opacity: 1 });

      // Single pinned timeline (pin + animation in ONE ScrollTrigger — no snap).
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
      // Video widens smoothly across the whole scrub (width only — height held constant).
      tl.fromTo(videoRef.current, { clipPath: CLIP_REST }, { clipPath: CLIP_WIDE, ease: 'power2.inOut', duration: 0.72 }, 0)
        // fromTo + immediateRender:false so it doesn't clobber the mount fade-in and
        // leave the 360° line stuck at opacity 0 at scroll-top.
        .fromTo(
          '.hero-meta',
          { opacity: 1, yPercent: 0 },
          { opacity: 0, yPercent: -30, ease: 'none', duration: 0.3, immediateRender: false },
          0,
        )
        // Text outro: the words fly hard apart AND fade right out, so by the end of the
        // scroll the headline has left the frame completely. `fromTo` (with default
        // immediateRender) pins the rest state (0/0/opacity-1), so scrolling back ALWAYS
        // returns every word exactly to rest — never stranded off-screen or half-faded.
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

      // Wrapper `.hero-3d` exists sync on desktop; fromTo keeps rest opacity at 1.
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
  }, [reducedMotion, isDesktop]);

  const words = hero.h1.split(' ');
  const subParts = hero.subtitle.split('360°'); // emphasise the 360° number

  return (
    // 290vh = the pinned frame (100vh) + its 190vh pin distance, so the pin-spacer fits and
    // the pinned hero never overlaps the next section.
    <section ref={containerRef} data-seamless-act className="relative h-[290vh]">
      <div ref={pinRef} className="relative h-screen overflow-hidden bg-charcoal">
        {/* Section pattern (parallax) over SeamlessActs shared field. Oversized so drift
            never flashes an edge. */}
        <div
          ref={patternRef}
          className="pattern-section-fade pointer-events-none absolute inset-0 will-change-transform"
        >
          <div className="absolute -inset-[8%]">
            <BrandPattern variant="dense" id="hero" half="left" className="opacity-20" />
          </div>
        </div>

        {/* Isolated blend group: video + 3D logo + text. `isolate` keeps the headline's
            difference blend confined to these layers (never the page bg). NO z-index on
            the children — stacking is by DOM order (video → 3D → content), so the headline
            (in the non-stacking-context content div) actually blends with the video + 3D. */}
        <div className="absolute inset-0 isolate">
          {/* Expanding autoplay video — vertical panel that widens on scroll. */}
          <div ref={videoRef} className="absolute inset-0" style={{ clipPath: CLIP_REST }}>
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-charcoal to-black">
              <BrandPattern variant="tiled" id="hero-video" />
            </div>
            {/* TEMP demo clip — replace src with Propagenda's own vertical (9:16) video. */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero-placeholder.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          </div>

          {/* Wrapper stays in DOM when desktop so GSAP can own opacity; canvas loads inside. */}
          {isDesktop ? (
            <div className="hero-3d absolute inset-0">
              <HeroLogo3D className="absolute inset-0 cursor-pointer" />
            </div>
          ) : null}

          {/* Content — paints on top via DOM order, no z-index (so the headline blend works).
              pointer-events-none so clicks pass through to the 3D canvas; the CTA re-enables. */}
          <div className="pointer-events-none relative flex h-full flex-col justify-center px-gutter-m pb-16 pt-28 lg:px-gutter-d">
            <h1 className="hero-headline mt-10 max-w-[15ch] font-sans text-[clamp(2.5rem,7.4vw,7.5rem)] font-bold uppercase leading-[0.95] tracking-display text-white lg:mt-16 [mix-blend-mode:difference]">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={cn('hero-word block will-change-transform', word === ACCENT_WORD && 'accent-word')}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p className="hero-meta mt-5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
              {subParts[0]}
              <span className="align-middle text-base font-extrabold text-orange sm:text-lg">360&deg;</span>
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
    </section>
  );
}
