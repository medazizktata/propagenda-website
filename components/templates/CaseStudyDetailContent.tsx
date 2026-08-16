'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import type {
  CaseStudyRecord,
  CaseStudyQuote,
  CaseStudyResult,
  GalleryImage,
} from '@/types/content';
import { getCaseStudy } from '@/lib/content/getCaseStudy';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { PageCTA } from '@/components/sections/PageCTA';
import { WorkNextPrev } from '@/components/sections/WorkNextPrev';
import { ScrollCue } from '@/components/molecules/ScrollCue';
import { PhotoSwipeLightbox } from '@/components/PhotoSwipeLightbox';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';

interface CaseStudyDetailContentProps {
  study: CaseStudyRecord;
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'sd-reveal mb-8 flex items-center gap-4 font-sans text-2xl font-bold text-white md:mb-10 md:text-3xl',
        className,
      )}
    >
      <span aria-hidden className="h-6 w-1.5 shrink-0 rounded-full bg-[color:var(--sd-accent)]" />
      {children}
    </h2>
  );
}

export function CaseStudyDetailContent({ study }: CaseStudyDetailContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Translate-only reveal — content is visible by default, motion only nudges it. Never blank.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sd-reveal').forEach((item) => {
        gsap.from(item, {
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 92%', once: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const meta = [study.client, study.industry, study.year].filter((v): v is string => Boolean(v));

  const stages = [
    { key: 'problem', name: 'The problem', body: study.challenge },
    { key: 'approach', name: 'The approach', body: study.approach },
    { key: 'result', name: 'The result', body: study.outcome },
  ].filter((s): s is { key: string; name: string; body: string } => Boolean(s.body));

  const prev = study.prev ? getCaseStudy(study.prev) : undefined;
  const next = study.next ? getCaseStudy(study.next) : undefined;

  const accentVars = {
    '--sd-accent': study.accent?.color ?? '#f58b27',
    '--sd-accent-on': study.accent?.onColor ?? '#0a0a0a',
  } as CSSProperties;

  const gallery = study.gallery;
  const { isOpen, index, open, close } = usePhotoSwipe();
  const openable = gallery.filter((g) => Boolean(g.src));
  const openAt = (galleryIndex: number) => {
    const img = gallery[galleryIndex];
    const oi = openable.findIndex((o) => o.src === img?.src && o.alt === img?.alt);
    if (oi >= 0) open(oi);
  };
  const canOpen = openable.length > 0;

  return (
    <div ref={rootRef} className="bg-charcoal" style={accentVars}>
      <CaseStudyHero study={study} meta={meta} reducedMotion={reducedMotion} />

      {/* Immersive story — overview + narrative scroll over a pinned, parallaxing brand backdrop. */}
      <CaseStudyStory
        study={study}
        overview={study.overview}
        stages={stages}
        reducedMotion={reducedMotion}
      />

      {study.results && study.results.length > 0 && <CaseStudyResults results={study.results} />}

      {gallery[1] && (
        <CaseStudyFeatureImage image={gallery[1]} canOpen={canOpen} onOpen={() => openAt(1)} />
      )}

      {study.deliverables && study.deliverables.length > 0 && (
        <CaseStudyDeliverables items={study.deliverables} />
      )}

      {gallery.length > 2 && (
        <CaseStudyGalleryMosaic images={gallery.slice(2)} canOpen={canOpen} onOpenAt={(i) => openAt(i + 2)} />
      )}

      {study.quote && <CaseStudyQuoteBlock quote={study.quote} />}

      <WorkNextPrev prev={prev} next={next} />

      <PageCTA line1="Ready to start" line2="something next." />

      {canOpen && <PhotoSwipeLightbox images={openable} isOpen={isOpen} initialIndex={index} onClose={close} />}
    </div>
  );
}

/* ───────────────────────── Hero (pinned, scaling) ───────────────────────── */

function CaseStudyHero({
  study,
  meta,
  reducedMotion,
}: {
  study: CaseStudyRecord;
  meta: string[];
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=55%', pin, scrub: true },
      });
      tl.to(imgRef.current, { scale: 1.16, ease: 'none' }, 0).to(
        contentRef.current,
        { y: -48, autoAlpha: 0, ease: 'none' },
        0,
      );
    }, wrap);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={wrapRef} className="relative">
      <div ref={pinRef} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div ref={imgRef} aria-hidden className="absolute inset-0 will-change-transform">
          {study.heroImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={study.heroImage} alt="" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-charcoal/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-charcoal/70" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-black" />
              <div className="absolute inset-y-0 right-0 w-[72%] opacity-[0.5]">
                <BrandPattern variant="dense" half="right" />
              </div>
              <div className="absolute -bottom-1/4 -left-[15%] h-[75%] w-[65%] rounded-full bg-[color:var(--sd-accent)] opacity-[0.13] blur-[130px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/25" />
            </>
          )}
        </div>

        <div className="relative z-content px-gutter-m pb-16 pt-28 lg:px-gutter-d lg:pb-24">
          <div ref={contentRef} className="will-change-transform">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <Link href="/work" className="transition-hover hover-fine:hover:text-[color:var(--sd-accent)]">
                Work
              </Link>
              <span aria-hidden className="text-white/35">/</span>
              <span className="text-white">{study.client ?? study.title}</span>
            </nav>

            <h1
              className="max-w-5xl text-balance font-sans font-bold uppercase leading-[0.94] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]"
              style={{ fontSize: 'clamp(2rem, 5.6vw, 5rem)' }}
            >
              {study.h1}
              <span className="text-[color:var(--sd-accent)]">.</span>
            </h1>

            {meta.length > 0 && (
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-medium text-white/85 md:text-lg">
                {meta.map((m, i) => (
                  <span key={`${m}-${i}`} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="text-[color:var(--sd-accent)]">·</span>}
                    {m}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <ScrollCue
          label="Scroll to the story"
          tipClassName="bg-[color:var(--sd-accent)]"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="focus-visible:outline-[color:var(--sd-accent)]"
        />
      </div>
    </section>
  );
}

/* ───────────── Immersive story (pinned backdrop, scrolling overview + beats) ───────────── */

// The centrepiece: a full-screen brand backdrop STAYS while the overview and each narrative
// beat scroll up over it (type-over-imagery interplay). The backdrop slowly zooms on scroll.
// Heavy scrim + text-shadow keep every word legible; content is normal-flow so it never blanks.
// Text-only studies use the monogram + an orange glow as the backdrop instead of a photo.
function CaseStudyStory({
  study,
  overview,
  stages,
  reducedMotion,
}: {
  study: CaseStudyRecord;
  overview: string;
  stages: { key: string; name: string; body: string }[];
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.05, yPercent: -2 },
        {
          scale: 1.22,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-charcoal">
      {/* Sticky, parallaxing backdrop. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            {study.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={study.heroImage} alt="" className="h-full w-full object-cover object-center" />
            ) : (
              <BrandPattern variant="dense" half="right" className="opacity-[0.45]" />
            )}
          </div>
          <div className="absolute inset-0 bg-charcoal/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/75" />
          <div className="absolute -right-[8%] top-1/4 h-[55%] w-[45%] rounded-full bg-[color:var(--sd-accent)] opacity-[0.13] blur-[140px]" />
        </div>
      </div>

      {/* Content scrolls over the backdrop. */}
      <div className="relative z-content">
        <div className="flex min-h-[92vh] items-center px-gutter-m lg:px-gutter-d">
          <p
            className="sd-reveal mx-auto w-full max-w-5xl font-sans font-semibold leading-[1.12] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.75)]"
            style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.5rem)' }}
          >
            {overview}
          </p>
        </div>

        {stages.map((s, i) => (
          <div key={s.key} className="flex min-h-[88vh] items-center px-gutter-m lg:px-gutter-d">
            <div className="sd-reveal mx-auto w-full max-w-4xl">
              <span className="mb-7 flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--sd-accent)] md:text-sm">
                <span aria-hidden className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden className="h-px w-8 shrink-0 bg-[color:var(--sd-accent)]/60" />
                {s.name}
              </span>
              <p
                className="text-pretty font-sans font-medium leading-[1.25] text-white [text-shadow:0_2px_36px_rgba(0,0,0,0.7)]"
                style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)' }}
              >
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Results / metrics band ───────────────────────── */

function CaseStudyResults({ results }: { results: CaseStudyResult[] }) {
  return (
    <section className="relative border-y border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-[10%] top-1/2 h-[60%] w-[40%] -translate-y-1/2 rounded-full bg-[color:var(--sd-accent)] opacity-[0.08] blur-[130px]" />
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionHeading>Results</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {results.map((r, i) => (
            <div
              key={r.label}
              className={cn(
                'sd-reveal py-6 md:px-8 md:py-2 lg:px-10 md:first:pl-0',
                i > 0 && 'border-t border-white/10 md:border-l md:border-t-0',
              )}
            >
              <div
                className="font-sans font-extrabold leading-none text-[color:var(--sd-accent)]"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
              >
                {r.value}
              </div>
              <div className="mt-3 font-medium leading-relaxed text-white/75 md:text-lg">{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Cinematic whole-board showcase (the real work, shown large) ───────────── */

function CaseStudyFeatureImage({
  image,
  canOpen,
  onOpen,
}: {
  image: GalleryImage;
  canOpen: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = ref.current;
    const inner = innerRef.current;
    if (!section || !inner) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <button
          type="button"
          onClick={canOpen ? onOpen : undefined}
          disabled={!canOpen}
          aria-label={canOpen ? `Open image: ${image.alt}` : image.alt}
          className={cn(
            'sd-reveal group/fi relative block w-full max-w-md shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 lg:w-[46%]',
            canOpen ? 'cursor-zoom-in' : 'cursor-default',
          )}
        >
          <div ref={innerRef} className="will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-[1241/1754] w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover-fine:group-hover/fi:scale-[1.04]"
            />
          </div>
        </button>
        <div className="sd-reveal lg:w-[54%]">
          <span className="mb-5 flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--sd-accent)]">
            <span aria-hidden className="h-px w-8 shrink-0 bg-[color:var(--sd-accent)]/60" />
            In focus
          </span>
          <p
            className="max-w-[34ch] font-sans leading-relaxed text-white/85"
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
          >
            {image.alt}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Deliverables (editorial list) ───────────────────────── */

function CaseStudyDeliverables({ items }: { items: string[] }) {
  return (
    <section className="relative bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div className="relative z-content mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(12rem,0.42fr)_1fr] lg:items-start lg:gap-20">
        <SectionHeading className="mb-0 md:mb-0">What we delivered</SectionHeading>

        <ul className="grid gap-x-14 gap-y-7 sm:grid-cols-2">
          {items.map((item, i) => (
            <li key={item} className="sd-reveal flex items-start gap-4">
              <span
                aria-hidden
                className="mt-0.5 shrink-0 font-mono text-xs font-semibold tracking-[0.12em] text-[color:var(--sd-accent)]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-sans text-base font-medium leading-snug text-white/90 md:text-lg">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Extra gallery (3+ images) ───────────────────────── */

function spanClass(count: number, i: number) {
  const desktop = [
    'md:col-span-2 md:row-span-2',
    'md:col-span-2 md:row-span-1',
    'md:col-span-1 md:row-span-1',
    'md:col-span-1 md:row-span-1',
  ];
  const mobile = i < 2 ? 'col-span-2' : 'col-span-1';
  return cn(mobile, desktop[i % desktop.length], count <= 3 && i === 0 && 'md:row-span-2');
}

function CaseStudyGalleryMosaic({
  images,
  canOpen,
  onOpenAt,
}: {
  images: GalleryImage[];
  canOpen: boolean;
  onOpenAt: (i: number) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      grid.querySelectorAll<HTMLElement>('[data-mosaic-img]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading>More visuals</SectionHeading>
        <div
          ref={gridRef}
          className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[12rem] md:grid-cols-4 md:gap-4"
        >
          {images.map((image, i) => (
            <button
              key={`${image.alt}-${i}`}
              type="button"
              onClick={canOpen ? () => onOpenAt(i) : undefined}
              disabled={!canOpen}
              aria-label={canOpen ? `Open image: ${image.alt}` : image.alt}
              className={cn(
                'group/tile sd-reveal relative overflow-hidden rounded-xl bg-white/[0.03] text-left',
                canOpen ? 'cursor-zoom-in' : 'cursor-default',
                spanClass(images.length, i),
              )}
            >
              {/* Parallax layer — taller than the tile so the scroll shift never reveals an edge. */}
              <div
                data-mosaic-img
                className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%] will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover-fine:group-hover/tile:scale-[1.06]"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Cinematic pull quote ───────────────────────── */

function CaseStudyQuoteBlock({ quote }: { quote: CaseStudyQuote }) {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black px-gutter-m py-28 lg:px-gutter-d lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <BrandPattern variant="tiled" />
      </div>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--sd-accent)] opacity-[0.1] blur-[150px]" />
      <figure className="relative z-content mx-auto max-w-4xl text-center">
        <span
          aria-hidden
          className="block font-sans font-extrabold leading-none text-[color:var(--sd-accent)]"
          style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
        >
          &ldquo;
        </span>
        <blockquote
          className="sd-reveal -mt-8 font-sans font-semibold leading-[1.12] text-white"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
        >
          {quote.text}
        </blockquote>
        <figcaption className="sd-reveal mt-8 flex items-center gap-3 text-lg font-medium text-white/70">
          <span aria-hidden className="h-px w-8 shrink-0 bg-orange" />
          {quote.author}
        </figcaption>
      </figure>
    </section>
  );
}
