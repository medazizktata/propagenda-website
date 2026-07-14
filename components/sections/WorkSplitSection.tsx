'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

// SMV curtain wipe: 4 stacked masks per half.
// Left = design (hover slideshow). Right = video in the FRONT curtain layer (hover plays)
// so the trailing curtain frames still apply. ~20% of scrub during approach, ~80% after lock.

type SlideshowMedia = { kind: 'slideshow'; slides: string[] };
type VideoMedia = { kind: 'video'; src: string; poster: string };
type PanelMedia = SlideshowMedia | VideoMedia;

type Panel = {
  title: string;
  cta: string;
  href: string;
  frames: [string, string, string, string];
  media: PanelMedia;
  tone: 'light' | 'orange';
  side: 'left' | 'right';
};

const DESIGN_SLIDES = [
  '/images/portfolio/work-sanapex.png',
  '/images/portfolio/work-food.png',
  '/images/portfolio/work-restaurant.png',
  '/images/portfolio/work-ghaftree.png',
  '/images/portfolio/work-events.png',
] as const;

const PANELS: Panel[] = [
  {
    title: 'Design Work',
    cta: 'View portfolio',
    href: '/work',
    frames: [DESIGN_SLIDES[1], DESIGN_SLIDES[2], DESIGN_SLIDES[3], DESIGN_SLIDES[0]],
    media: { kind: 'slideshow', slides: [...DESIGN_SLIDES] },
    tone: 'light',
    side: 'left',
  },
  {
    title: 'Video Work',
    cta: 'See film & photo',
    href: '/services/photography-videography',
    frames: [
      '/images/portfolio/work-events.png',
      '/images/portfolio/work-quickcars.png',
      '/images/portfolio/work-ghaftree.png',
      '/images/portfolio/work-restaurant.png',
    ],
    media: {
      kind: 'video',
      src: '/videos/hero-placeholder.mp4',
      poster: '/images/portfolio/work-events.png',
    },
    tone: 'orange',
    side: 'right',
  },
];

const LAYER_IDS = ['main', 'dup1', 'dup2', 'dup3'] as const;

function FrontSlideshow({ slides, active }: { slides: string[]; active: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [active, slides.length]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {/* Rest frame — same as last curtain image until hover kicks in. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slides[0]}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-hover',
          active ? 'opacity-0' : 'opacity-100',
        )}
      />
      {slides.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            active && i === index ? 'opacity-100' : 'opacity-0',
            active && i === index && 'scale-105 transition-transform duration-300',
          )}
        />
      ))}
    </div>
  );
}

function FrameStack({
  frames,
  side,
  media,
  hovered,
}: {
  frames: Panel['frames'];
  side: 'left' | 'right';
  media: PanelMedia;
  hovered: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media.kind !== 'video' || !videoRef.current) return;
    const el = videoRef.current;
    if (hovered) {
      void el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [hovered, media]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYER_IDS.map((id, i) => {
        const isFront = i === LAYER_IDS.length - 1;
        return (
          <div
            key={id}
            className={cn(
              'work-pic-mask absolute inset-y-0 overflow-hidden will-change-[width]',
              side === 'left' ? 'left-0' : 'right-0',
              id === 'main' ? 'work-pic-main' : `work-pic-${id}`,
            )}
            style={{ width: 0, zIndex: i + 1 }}
          >
            {/* Front layer = interactive media, clipped by the same curtain mask as video. */}
            {isFront && media.kind === 'video' ? (
              <video
                ref={videoRef}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-hover',
                  hovered && 'scale-105',
                )}
                src={media.src}
                poster={media.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
            ) : isFront && media.kind === 'slideshow' ? (
              <FrontSlideshow slides={media.slides} active={hovered} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frames[i]}
                alt=""
                aria-hidden
                className="block h-full w-full object-cover"
              />
            )}
            <div
              className={cn(
                'absolute inset-0 transition-hover',
                hovered ? 'bg-black/65' : 'bg-black/30',
              )}
              aria-hidden
            />
          </div>
        );
      })}
    </div>
  );
}

function CurtainPanel({ panel, ready }: { panel: Panel; ready: boolean }) {
  const [hovered, setHovered] = useState(false);
  const words = panel.title.replace(/\.$/, '').split(/\s+/);
  const active = ready && hovered;

  useEffect(() => {
    if (!ready) setHovered(false);
  }, [ready]);

  return (
    <Link
      href={panel.href}
      className="group relative flex h-1/2 w-full flex-col items-center justify-center md:h-full md:w-1/2"
      onMouseEnter={() => {
        if (ready) setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        if (ready) setHovered(true);
      }}
      onBlur={() => setHovered(false)}
    >
      <FrameStack
        frames={panel.frames}
        side={panel.side}
        media={panel.media}
        hovered={active}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-10">
        <h3
          className={cn(
            'text-center font-sans font-black uppercase leading-[0.75] tracking-tight',
            panel.tone === 'orange' ? 'text-orange' : 'text-white',
          )}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 10.4vw)' }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="work-reveal-word block will-change-transform">
              {word}
              {i === words.length - 1 ? '.' : ''}
            </span>
          ))}
        </h3>

        <span
          className={cn(
            'work-btn mt-4 inline-flex items-center rounded-pill border-2 px-8 py-2.5 text-sm font-bold uppercase tracking-wide transition-hover md:mt-[1vw]',
            panel.tone === 'orange'
              ? cn(
                  'border-orange text-orange',
                  active && 'bg-orange text-black',
                )
              : cn(
                  'border-white text-white',
                  active && 'bg-white text-black',
                ),
          )}
        >
          {panel.cta}
        </span>
      </div>
    </Link>
  );
}

export function WorkSplitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [curtainsReady, setCurtainsReady] = useState(!!reducedMotion);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;

    if (reducedMotion) {
      gsap.set(sectionRef.current.querySelectorAll('.work-pic-mask'), { width: '100%' });
      gsap.set(sectionRef.current.querySelectorAll('.work-reveal-word'), {
        opacity: 1,
        yPercent: 0,
      });
      gsap.set(sectionRef.current.querySelectorAll('.work-btn'), { opacity: 1, yPercent: 0 });
      readyRef.current = true;
      setCurtainsReady(true);
      return;
    }

    readyRef.current = false;
    setCurtainsReady(false);

    const ctx = gsap.context(() => {
      gsap.set('.work-pic-mask', { width: 0 });
      gsap.set('.work-reveal-word', { opacity: 0, yPercent: 70 });
      gsap.set('.work-btn', { opacity: 0, yPercent: 50 });

      // Full section scroll: approach ≈ first ~20–25% of progress, pin hold ≈ the rest.
      // Pack ~20% of motion into the approach tease, ~80% into the locked scrub.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: () => {
          const ready = tl.progress() >= 0.995;
          if (ready === readyRef.current) return;
          readyRef.current = ready;
          setCurtainsReady(ready);
        },
      });

      // --- 20%: soft tease while methodology → work handoff ---
      tl.fromTo(
        '.work-reveal-word',
        { opacity: 0, yPercent: 70 },
        {
          opacity: 0.35,
          yPercent: 45,
          ease: 'none',
          duration: 0.2,
          stagger: 0.03,
          immediateRender: false,
        },
        0,
      )
        .fromTo(
          '.work-pic-main',
          { width: 0 },
          { width: '14%', ease: 'none', duration: 0.2, immediateRender: false },
          0,
        )
        .fromTo(
          '.work-pic-dup1',
          { width: 0 },
          { width: '9%', ease: 'none', duration: 0.2, immediateRender: false },
          0.04,
        )
        .fromTo(
          '.work-pic-dup2',
          { width: 0 },
          { width: '5%', ease: 'none', duration: 0.2, immediateRender: false },
          0.08,
        )

        // --- 80%: main reveal once locked into the section ---
        .to(
          '.work-reveal-word',
          {
            opacity: 1,
            yPercent: 0,
            ease: 'power2.out',
            duration: 0.7,
            stagger: 0.06,
          },
          0.22,
        )
        .fromTo(
          '.work-btn',
          { opacity: 0, yPercent: 50 },
          { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.55, immediateRender: false },
          0.32,
        )
        .to('.work-pic-main', { width: '100%', duration: 0.72, ease: 'power2.out' }, 0.22)
        .to('.work-pic-dup1', { width: '100%', duration: 0.72, ease: 'power2.out' }, 0.34)
        .to('.work-pic-dup2', { width: '100%', duration: 0.72, ease: 'power2.out' }, 0.46)
        .fromTo(
          '.work-pic-dup3',
          { width: 0 },
          { width: '100%', duration: 0.68, ease: 'power2.out', immediateRender: false },
          0.56,
        );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: pinRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pinSpacing: false,
        anticipatePin: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="work-split" ref={sectionRef} className="relative h-[250vh] md:h-[280vh]">
      <div
        ref={pinRef}
        className="relative top-0 flex h-[100dvh] w-full flex-col overflow-hidden bg-charcoal md:flex-row"
      >
        <div className="pattern-section-fade pointer-events-none absolute inset-0">
          <BrandPattern variant="tiled" id="work-split" />
        </div>

        {PANELS.map((panel) => (
          <CurtainPanel key={panel.href} panel={panel} ready={curtainsReady} />
        ))}
      </div>
    </section>
  );
}
