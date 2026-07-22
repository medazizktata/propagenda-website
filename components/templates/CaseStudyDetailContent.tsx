'use client';

import { useEffect, useRef, useState } from 'react';
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
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CTABand } from '@/components/sections/CTABand';
import { PhotoSwipeLightbox } from '@/components/PhotoSwipeLightbox';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';

interface CaseStudyDetailContentProps {
  study: CaseStudyRecord;
}

const num = (i: number) => String(i + 1).padStart(2, '0');

// A small check node — reused for delivered items. Functional "handled" marker (not a
// decorative arrow), same visual language as the services check nodes.
function CheckNode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseStudyDetailContent({ study }: CaseStudyDetailContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Shared scroll-reveal for every `.sd-reveal` node below the hero — same pattern as the
  // service detail pages, so the two page types feel like one system.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.sd-reveal');
      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const meta = [study.client, study.industry, study.year].filter(
    (v): v is string => Boolean(v),
  );

  const stages = [
    { key: 'problem', name: 'The problem', body: study.challenge },
    { key: 'approach', name: 'The approach', body: study.approach },
    { key: 'result', name: 'The result', body: study.outcome },
  ].filter(
    (s): s is { key: string; name: string; body: string } => Boolean(s.body),
  );

  const prev = study.prev ? getCaseStudy(study.prev) : undefined;
  const next = study.next ? getCaseStudy(study.next) : undefined;

  // Per-client body accent → CSS vars scoped to the case-study body. Sub-sections read
  // them via `var(--sd-accent)` so Sanapex (sand) and P2P (gold) feel tailored, while
  // the global orange/navy chrome (header, footer, CTA, prev/next) is left untouched.
  // Absent accent falls back to brand orange, so every other study is unchanged.
  const accentVars = {
    '--sd-accent': study.accent?.color ?? '#f58b27',
    '--sd-accent-on': study.accent?.onColor ?? '#0f151f',
  } as CSSProperties;

  return (
    <div ref={rootRef} className="bg-charcoal" style={accentVars}>
      <CaseStudyHero study={study} meta={meta} reducedMotion={reducedMotion} />

      <CaseStudyNarrative overview={study.overview} stages={stages} />

      {study.results && study.results.length > 0 && (
        <CaseStudyResults results={study.results} />
      )}

      {study.deliverables && study.deliverables.length > 0 && (
        <CaseStudyDeliverables items={study.deliverables} />
      )}

      {study.gallery.length > 0 && <CaseStudyGallery images={study.gallery} />}

      {study.quote && <CaseStudyQuoteBlock quote={study.quote} />}

      <CaseStudyPrevNext prev={prev} next={next} reducedMotion={reducedMotion} />

      <CTABand />
    </div>
  );
}

/* ───────────────────────── Hero (pinned, scaling) ───────────────────────── */

// Full-bleed hero on the project's own imagery. As it pins, the image zooms while the title
// block scales down and fades — a cinematic hold before the story begins. Reduced motion gets
// the same composition, static.
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
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=65%',
          pin,
          scrub: true,
        },
      });
      tl.to(imgRef.current, { scale: 1.16, ease: 'none' }, 0).to(
        contentRef.current,
        { y: -40, scale: 0.9, autoAlpha: 0.08, ease: 'none' },
        0,
      );
    }, wrap);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={wrapRef} className="relative">
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        <div ref={imgRef} aria-hidden className="absolute inset-0 will-change-transform">
          {study.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={study.heroImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="pattern-section-fade absolute inset-0">
              <BrandPattern variant="dense" half="right" className="opacity-25" />
            </div>
          )}
          <div className="absolute inset-0 bg-charcoal/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-charcoal/70" />
        </div>

        <div className="relative z-content px-gutter-m pb-16 pt-28 lg:px-gutter-d lg:pb-24">
          <div ref={contentRef} className="origin-bottom-left will-change-transform">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/55"
            >
              <Link
                href="/work"
                className="transition-hover hover-fine:hover:text-[color:var(--sd-accent)]"
              >
                Work
              </Link>
              <span aria-hidden className="text-white/25">
                /
              </span>
              <span className="text-white/85">{study.client ?? study.title}</span>
            </nav>

            <h1
              className="max-w-5xl font-sans font-bold uppercase leading-[0.92] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
              style={{ fontSize: 'clamp(2rem, 5.6vw, 5rem)' }}
            >
              {study.h1}
              <span className="text-[color:var(--sd-accent)]">.</span>
            </h1>

            {meta.length > 0 && (
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-white/70 md:text-lg">
                {meta.map((m, i) => (
                  <span key={`${m}-${i}`} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden className="text-[color:var(--sd-accent)]">
                        ·
                      </span>
                    )}
                    {m}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll to the story"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 z-content flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[color:var(--sd-accent)] text-[color:var(--sd-accent)] transition-hover hover-fine:hover:bg-[color:var(--sd-accent)] hover-fine:hover:text-[color:var(--sd-accent-on)] motion-safe:animate-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ───────────── Narrative: overview lead → problem / approach / result ───────────── */

function CaseStudyNarrative({
  overview,
  stages,
}: {
  overview: string;
  stages: { key: string; name: string; body: string }[];
}) {
  return (
    <section className="relative overflow-hidden px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <p
          className="sd-reveal max-w-3xl font-sans font-medium leading-snug text-white"
          style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.1rem)' }}
        >
          {overview}
        </p>

        {stages.length > 0 && (
          <div className="mt-14 border-t border-white/10">
            {stages.map((s, i) => (
              <div
                key={s.key}
                className="sd-reveal grid gap-4 border-b border-white/10 py-10 md:grid-cols-[minmax(0,0.85fr)_1.6fr] md:gap-12 md:py-14"
              >
                <div className="flex items-start gap-5">
                  <span
                    className="font-sans font-black leading-none text-white/[0.12]"
                    style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
                  >
                    {num(i)}
                  </span>
                  <h2 className="pt-1 font-sans text-xl font-bold tracking-tight text-[color:var(--sd-accent)] md:text-2xl">
                    {s.name}
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-white/75 md:text-xl">{s.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Results / metrics band ───────────────────────── */

// Big numbers on a distinct flat band, split by hairline rules — no cards.
function CaseStudyResults({ results }: { results: CaseStudyResult[] }) {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-navy px-gutter-m py-16 lg:px-gutter-d lg:py-20">
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-10 text-[color:var(--sd-accent)]">
          Results
        </SectionLabel>
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
                className="font-sans font-black leading-none text-[color:var(--sd-accent)]"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
              >
                {r.value}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                {r.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Deliverables ───────────────────────── */

// Flat two-column divided list — natural case (no forced uppercase), check node per item.
function CaseStudyDeliverables({ items }: { items: string[] }) {
  return (
    <section className="relative overflow-hidden px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-8 text-[color:var(--sd-accent)]">
          What we delivered
        </SectionLabel>
        <ul className="sd-reveal grid border-t border-white/12 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="group/dl flex items-start gap-4 border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:bg-white/[0.02] sm:px-6 sm:odd:border-r sm:odd:border-r-white/10"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-[color:var(--sd-accent)] transition-colors duration-300 group-hover/dl:border-[color:var(--sd-accent)] group-hover/dl:bg-[color:var(--sd-accent)] group-hover/dl:text-[color:var(--sd-accent-on)]">
                <CheckNode className="h-3 w-3" />
              </span>
              <span className="font-sans font-medium leading-snug text-white md:text-lg">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Gallery (asymmetric mosaic + lightbox) ───────────────────────── */

// Asymmetric spans: one big feature + varied tiles. `grid-flow-dense` backfills any gap so
// 3- and 4-image sets both tile cleanly.
function spanClass(count: number, i: number) {
  if (count <= 3) {
    const desktop = [
      'md:col-span-2 md:row-span-2',
      'md:col-span-2 md:row-span-1',
      'md:col-span-2 md:row-span-1',
    ];
    return cn(i === 0 ? 'col-span-2' : 'col-span-1', desktop[i] ?? 'md:col-span-2');
  }
  const desktop = [
    'md:col-span-2 md:row-span-2',
    'md:col-span-2 md:row-span-1',
    'md:col-span-1 md:row-span-1',
    'md:col-span-1 md:row-span-1',
  ];
  const mobile = i < 2 ? 'col-span-2' : 'col-span-1';
  return cn(mobile, desktop[i % desktop.length]);
}

function CaseStudyGallery({ images }: { images: GalleryImage[] }) {
  const { isOpen, index, open, close } = usePhotoSwipe();
  const openable = images.filter((image) => Boolean(image.src));

  const openAt = (galleryIndex: number) => {
    const image = images[galleryIndex];
    const openableIndex = openable.findIndex(
      (item) => item.src === image.src && item.alt === image.alt,
    );
    if (openableIndex >= 0) open(openableIndex);
  };

  // With only a couple of real frames (as the fully-branded studies have), the dense
  // mosaic would leave lopsided gaps and read sparse. Instead show each frame large and
  // whole — a magazine-style spread of the actual brand boards — so two images still feel
  // rich. Three-plus frames keep the asymmetric mosaic.
  const isSpread = images.length <= 2;

  return (
    <section className="relative px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionLabel className="sd-reveal mb-8 text-[color:var(--sd-accent)]">
          Selected visuals
        </SectionLabel>
        {isSpread ? (
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
            {images.map((image, i) => (
              <figure key={`${image.alt}-${i}`} className="sd-reveal">
                <button
                  type="button"
                  onClick={() => (openable.length > 0 ? openAt(i) : undefined)}
                  disabled={openable.length === 0}
                  aria-label={openable.length > 0 ? `Open image: ${image.alt}` : image.alt}
                  className={cn(
                    // Frame matches the source A4 aspect, so the whole board shows with no
                    // crop or letterbox — nothing is cut off, nothing is padded.
                    'group/tile relative block aspect-[1241/1754] w-full overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-inset ring-white/10',
                    openable.length > 0 ? 'cursor-zoom-in' : 'cursor-default',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover-fine:group-hover/tile:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 hover-fine:group-hover/tile:bg-charcoal/10"
                  />
                </button>
                <figcaption className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-white/55 md:text-base">
                  {image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[12rem] md:grid-cols-4 md:gap-4">
            {images.map((image, i) => (
              <button
                key={`${image.alt}-${i}`}
                type="button"
                onClick={() => (openable.length > 0 ? openAt(i) : undefined)}
                disabled={openable.length === 0}
                aria-label={openable.length > 0 ? `Open image: ${image.alt}` : image.alt}
                className={cn(
                  'group/tile sd-reveal relative overflow-hidden rounded-xl bg-white/[0.03] text-left',
                  openable.length > 0 ? 'cursor-zoom-in' : 'cursor-default',
                  spanClass(images.length, i),
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover-fine:group-hover/tile:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent opacity-0 transition-opacity duration-300 hover-fine:group-hover/tile:opacity-100"
                />
                <span className="absolute inset-x-4 bottom-4 translate-y-2 font-sans text-sm font-semibold text-white opacity-0 transition-all duration-300 hover-fine:group-hover/tile:translate-y-0 hover-fine:group-hover/tile:opacity-100">
                  {image.alt}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {openable.length > 0 && (
        <PhotoSwipeLightbox
          images={openable}
          isOpen={isOpen}
          initialIndex={index}
          onClose={close}
        />
      )}
    </section>
  );
}

/* ───────────────────────── Pull quote ───────────────────────── */

function CaseStudyQuoteBlock({ quote }: { quote: CaseStudyQuote }) {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-navy px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <figure className="relative z-content mx-auto max-w-4xl">
        <span
          aria-hidden
          className="block font-sans font-black leading-none text-[color:var(--sd-accent)]"
          style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
        >
          &ldquo;
        </span>
        <span
          aria-hidden
          className="sd-reveal -mt-4 mb-6 block h-1 w-16 rounded-full bg-[color:var(--sd-accent)]"
        />
        <blockquote
          className="sd-reveal font-sans font-semibold leading-[1.15] text-white"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
        >
          {quote.text}
        </blockquote>
        <figcaption className="sd-reveal mt-8 text-base text-white/55 md:text-lg">
          &mdash; {quote.author}
        </figcaption>
      </figure>
    </section>
  );
}

/* ───────────────────────── Cinematic prev / next ───────────────────────── */

function CaseStudyPrevNext({
  prev,
  next,
  reducedMotion,
}: {
  prev?: CaseStudyRecord;
  next?: CaseStudyRecord;
  reducedMotion: boolean;
}) {
  if (!prev && !next) return null;
  return (
    <section className="relative border-t border-white/10 bg-charcoal">
      {next && <NextProjectPanel study={next} reducedMotion={reducedMotion} />}
      {prev && (
        <div className="border-t border-white/10 px-gutter-m py-8 lg:px-gutter-d">
          <Link
            href={`/work/${prev.slug}`}
            className="group/prev inline-flex items-center gap-3 text-sm text-white/55 transition-hover hover-fine:hover:text-orange"
          >
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover/prev:-translate-x-1"
            >
              &larr;
            </span>
            <span>Previous project</span>
            <span className="font-medium text-white/85">{prev.client ?? prev.title}</span>
          </Link>
        </div>
      )}
    </section>
  );
}

// The next project rendered oversized: display-scale outlined name that fills in and reveals
// its imagery on hover/focus. On touch (no hover) the name is solid and legible by default.
function NextProjectPanel({
  study,
  reducedMotion,
}: {
  study: CaseStudyRecord;
  reducedMotion: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/work/${study.slug}`}
      aria-label={`Next project: ${study.title}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group/next relative flex min-h-[45vh] flex-col justify-center overflow-hidden px-gutter-m py-20 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange lg:min-h-[60vh] lg:px-gutter-d"
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out',
          hovered ? 'opacity-100' : 'opacity-0',
        )}
      >
        {study.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={study.heroImage}
            alt=""
            className={cn(
              'h-full w-full object-cover',
              !reducedMotion &&
                'scale-105 transition-transform duration-700 ease-out group-hover/next:scale-110',
            )}
          />
        )}
        <div className="absolute inset-0 bg-charcoal/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/70" />
      </div>

      <div
        aria-hidden
        className={cn(
          'pattern-section-fade absolute inset-0 transition-opacity duration-500',
          hovered ? 'opacity-0' : 'opacity-100',
        )}
      >
        <BrandPattern variant="tiled" />
      </div>

      <div className="relative z-content mx-auto w-full max-w-6xl">
        <span
          className={cn(
            'mb-4 block text-sm font-semibold transition-colors duration-300',
            hovered ? 'text-orange' : 'text-white/45',
          )}
        >
          Next project
        </span>
        <span
          className={cn(
            'block font-sans font-black uppercase leading-[0.9] tracking-tight transition-colors duration-500 ease-out touch-coarse:text-white touch-coarse:[-webkit-text-stroke:0px]',
            hovered
              ? 'text-white [-webkit-text-stroke:0px]'
              : 'text-transparent [-webkit-text-stroke:1.5px_#f58b27]',
          )}
          style={{ fontSize: 'clamp(2rem, 8vw, 6.5rem)' }}
        >
          {study.client ?? study.title}
        </span>
        {(study.industry || study.year) && (
          <span
            className={cn(
              'mt-5 block max-w-xl text-base text-white/70 transition-all duration-300 md:text-lg',
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70',
            )}
          >
            {[study.industry, study.year].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
    </Link>
  );
}
