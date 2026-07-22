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
import { PhotoSwipeLightbox } from '@/components/PhotoSwipeLightbox';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';

interface CaseStudyDetailContentProps {
  study: CaseStudyRecord;
}

// A small check node — functional "handled" marker (not a decorative arrow).
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

// Section heading — a real heading in natural case, NOT a tracked-out uppercase eyebrow.
// One short orange tick anchors it to the brand without the AI-scaffold kicker.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="sd-reveal mb-8 flex items-center gap-4 font-sans text-2xl font-bold text-white md:mb-10 md:text-3xl">
      <span aria-hidden className="h-6 w-1.5 shrink-0 rounded-full bg-[color:var(--sd-accent)]" />
      {children}
    </h2>
  );
}

export function CaseStudyDetailContent({ study }: CaseStudyDetailContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Scroll reveal for `.sd-reveal` nodes. TRANSLATE-ONLY: content is fully visible by
  // default (SSR + no-JS + reduced-motion all render it in place) and the animation only
  // nudges it up on entry. It never gates opacity, so nothing can ever ship blank — the
  // failure mode the previous version hit when the pinned hero desynced ScrollTrigger.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sd-reveal').forEach((item) => {
        gsap.from(item, {
          y: 26,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 90%', once: true },
        });
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

  // Accent stays the brand orange for every study (client-brand accents were removed per
  // direction — the site keeps Propagenda's identity). Kept as a var so the whole body
  // reads from one source. Text-on-accent is near-black; navy is never used as a fill.
  const accentVars = {
    '--sd-accent': study.accent?.color ?? '#f58b27',
    '--sd-accent-on': study.accent?.onColor ?? '#0a0a0a',
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

      <ClosingCTA />
    </div>
  );
}

/* ───────────────────────── Hero (pinned, scaling) ───────────────────────── */

// Full-bleed hero. Image studies zoom their own photography; text-only studies get a bold,
// deliberate monogram field + orange glow (brand art, never an empty void or a faint wash).
// As it pins the frame zooms and the title lifts fully away — no ghost bleeds into the story.
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
        { y: -48, autoAlpha: 0, ease: 'none' },
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
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={study.heroImage}
                alt=""
                className="h-full w-full object-cover object-center"
              />
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
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70"
            >
              <Link
                href="/work"
                className="transition-hover hover-fine:hover:text-[color:var(--sd-accent)]"
              >
                Work
              </Link>
              <span aria-hidden className="text-white/35">
                /
              </span>
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

// Editorial narrative. NO numbered scaffolding, NO pattern behind copy. A large legible
// lead, then each beat as a bold orange label paired with high-contrast body text on a
// solid surface. Reads like a story, not a template.
function CaseStudyNarrative({
  overview,
  stages,
}: {
  overview: string;
  stages: { key: string; name: string; body: string }[];
}) {
  return (
    <section className="relative bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div className="relative z-content mx-auto max-w-6xl">
        <p
          className="sd-reveal max-w-[24ch] font-sans font-semibold leading-[1.1] text-white md:max-w-[26ch]"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          {overview}
        </p>

        {stages.length > 0 && (
          <div className="mt-16 md:mt-20">
            {stages.map((s) => (
              <div
                key={s.key}
                className="sd-reveal grid gap-4 border-t border-white/12 py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-14 md:py-14"
              >
                <h3
                  className="font-sans font-bold leading-[1.05] text-[color:var(--sd-accent)]"
                  style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)' }}
                >
                  {s.name}
                </h3>
                <p
                  className="max-w-[68ch] text-pretty font-sans leading-relaxed text-white/90"
                  style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)' }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Results / metrics band ───────────────────────── */

// Big numbers on a near-black band (tonal step from charcoal — never navy), split by
// hairline rules. No cards.
function CaseStudyResults({ results }: { results: CaseStudyResult[] }) {
  return (
    <section className="relative border-y border-white/10 bg-black px-gutter-m py-16 lg:px-gutter-d lg:py-24">
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
                className="font-sans font-black leading-none text-[color:var(--sd-accent)]"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
              >
                {r.value}
              </div>
              <div className="mt-3 font-medium leading-relaxed text-white/75 md:text-lg">
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

// Flat two-column divided list — natural case, check node per item. No pattern, no cards.
function CaseStudyDeliverables({ items }: { items: string[] }) {
  return (
    <section className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionHeading>What we delivered</SectionHeading>
        <ul className="grid border-t border-white/12 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="sd-reveal group/dl flex items-start gap-4 border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:bg-white/[0.03] sm:px-6 sm:odd:border-r sm:odd:border-r-white/10"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 text-[color:var(--sd-accent)] transition-colors duration-300 group-hover/dl:border-[color:var(--sd-accent)] group-hover/dl:bg-[color:var(--sd-accent)] group-hover/dl:text-[color:var(--sd-accent-on)]">
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

  // ≤2 real frames (the fully-branded studies) show large and whole — a magazine-style
  // spread of the actual brand boards. 3+ keep the asymmetric mosaic.
  const isSpread = images.length <= 2;

  return (
    <section className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading>Selected visuals</SectionHeading>
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
                <figcaption className="mt-4 max-w-prose font-sans leading-relaxed text-white/70 md:text-lg">
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

// Oversized quote on a near-black band. All text is visible by default (only .sd-reveal
// nudges position), so the words are never invisible.
function CaseStudyQuoteBlock({ quote }: { quote: CaseStudyQuote }) {
  return (
    <section className="relative border-y border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <figure className="relative z-content mx-auto max-w-4xl">
        <span
          aria-hidden
          className="block font-sans font-black leading-none text-[color:var(--sd-accent)]"
          style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
        >
          &ldquo;
        </span>
        <blockquote
          className="sd-reveal -mt-6 font-sans font-semibold leading-[1.15] text-white"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
        >
          {quote.text}
        </blockquote>
        <figcaption className="sd-reveal mt-8 text-lg font-medium text-white/70">
          &mdash; {quote.author}
        </figcaption>
      </figure>
    </section>
  );
}

/* ───────────────────────── Closing CTA (bespoke, never navy) ───────────────────────── */

function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal px-gutter-m py-24 text-center lg:px-gutter-d lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <BrandPattern variant="tiled" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--sd-accent)] opacity-[0.12] blur-[130px]"
      />
      <div className="relative z-content mx-auto max-w-3xl">
        <h2
          className="font-sans font-bold uppercase leading-[0.95] tracking-tight text-white"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
        >
          Ready to start
          <span className="text-[color:var(--sd-accent)]">?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80 md:text-xl">
          Let&rsquo;s build a brand worth talking about.
        </p>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center justify-center rounded-full bg-[color:var(--sd-accent)] px-8 py-4 font-sans text-base font-semibold text-[color:var(--sd-accent-on)] transition-transform duration-300 ease-out hover-fine:hover:-translate-y-0.5"
        >
          Contact us
        </Link>
      </div>
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
            className="group/prev inline-flex items-center gap-3 text-sm text-white/70 transition-hover hover-fine:hover:text-orange"
          >
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover/prev:-translate-x-1"
            >
              &larr;
            </span>
            <span>Previous project</span>
            <span className="font-semibold text-white">{prev.client ?? prev.title}</span>
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
          'absolute inset-0 opacity-[0.08] transition-opacity duration-500',
          hovered ? 'opacity-0' : 'opacity-[0.08]',
        )}
      >
        <BrandPattern variant="tiled" />
      </div>

      <div className="relative z-content mx-auto w-full max-w-6xl">
        <span
          className={cn(
            'mb-4 block text-sm font-semibold transition-colors duration-300',
            hovered ? 'text-orange' : 'text-white/70',
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
              'mt-5 block max-w-xl text-base text-white/80 transition-all duration-300 md:text-lg',
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80',
            )}
          >
            {[study.industry, study.year].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
    </Link>
  );
}
