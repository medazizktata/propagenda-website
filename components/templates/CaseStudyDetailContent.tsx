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
import { WorkNextPrev } from '@/components/sections/WorkNextPrev';
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

  // Scroll reveal — TRANSLATE-ONLY: content is fully visible by default (SSR/no-JS/reduced-
  // motion/before-trigger), motion only nudges position. Nothing can ever ship blank.
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

  const accentVars = {
    '--sd-accent': study.accent?.color ?? '#f58b27',
    '--sd-accent-on': study.accent?.onColor ?? '#0a0a0a',
  } as CSSProperties;

  // Real brand imagery is WOVEN through the story as full-frame moments, not dumped in a
  // gallery at the end — so an image study reads as an art-directed piece, not a template.
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

      <CaseStudyLead overview={study.overview} />

      {gallery[0] && (
        <CaseStudyFeatureImage
          image={gallery[0]}
          flip={false}
          canOpen={canOpen}
          onOpen={() => openAt(0)}
        />
      )}

      {stages.length > 0 && <CaseStudyStages stages={stages} />}

      {study.results && study.results.length > 0 && (
        <CaseStudyResults results={study.results} />
      )}

      {gallery[1] && (
        <CaseStudyFeatureImage
          image={gallery[1]}
          flip
          canOpen={canOpen}
          onOpen={() => openAt(1)}
        />
      )}

      {study.deliverables && study.deliverables.length > 0 && (
        <CaseStudyDeliverables items={study.deliverables} />
      )}

      {gallery.length > 2 && (
        <CaseStudyGalleryMosaic
          images={gallery.slice(2)}
          canOpen={canOpen}
          onOpenAt={(i) => openAt(i + 2)}
        />
      )}

      {study.quote && <CaseStudyQuoteBlock quote={study.quote} />}

      <WorkNextPrev prev={prev} next={next} />

      <ClosingCTA />

      {canOpen && (
        <PhotoSwipeLightbox images={openable} isOpen={isOpen} initialIndex={index} onClose={close} />
      )}
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

        <button
          type="button"
          aria-label="Scroll to the story"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 z-content flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[color:var(--sd-accent)] text-[color:var(--sd-accent)] transition-hover hover-fine:hover:bg-[color:var(--sd-accent)] hover-fine:hover:text-[color:var(--sd-accent-on)] motion-safe:animate-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ───────────── Narrative: lead statement + problem / approach / result ───────────── */

function CaseStudyLead({ overview }: { overview: string }) {
  return (
    <section className="relative bg-charcoal px-gutter-m pt-20 lg:px-gutter-d lg:pt-28">
      <div className="relative z-content mx-auto max-w-6xl">
        <p
          className="sd-reveal max-w-[24ch] font-sans font-semibold leading-[1.1] text-white md:max-w-[26ch]"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          {overview}
        </p>
      </div>
    </section>
  );
}

function CaseStudyStages({
  stages,
}: {
  stages: { key: string; name: string; body: string }[];
}) {
  return (
    <section className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="relative z-content mx-auto max-w-6xl">
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
    </section>
  );
}

/* ───────────────── Woven full-frame brand image (editorial, alternating) ───────────────── */

// The real A4 brand board shown WHOLE beside an oversized caption — an art-directed moment
// in the story, not a cropped banner. Alternates side by `flip`. Opens the lightbox.
function CaseStudyFeatureImage({
  image,
  flip,
  canOpen,
  onOpen,
}: {
  image: GalleryImage;
  flip: boolean;
  canOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <section className="relative border-y border-white/10 bg-black px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div
        className={cn(
          'mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:gap-16',
          flip && 'lg:flex-row-reverse',
        )}
      >
        <button
          type="button"
          onClick={canOpen ? onOpen : undefined}
          disabled={!canOpen}
          aria-label={canOpen ? `Open image: ${image.alt}` : image.alt}
          className={cn(
            'sd-reveal group/fi relative block w-full max-w-sm shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 lg:w-[40%]',
            canOpen ? 'cursor-zoom-in' : 'cursor-default',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-[1241/1754] w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover-fine:group-hover/fi:scale-[1.03]"
          />
        </button>
        <p
          className="sd-reveal max-w-[34ch] font-sans leading-relaxed text-white/85 lg:w-[60%]"
          style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.6rem)' }}
        >
          {image.alt}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Results / metrics band ───────────────────────── */

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
              <div className="mt-3 font-medium leading-relaxed text-white/75 md:text-lg">{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Deliverables ───────────────────────── */

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
              <span className="font-sans font-medium leading-snug text-white md:text-lg">{item}</span>
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
  return (
    <section className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading>More visuals</SectionHeading>
        <div className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[12rem] md:grid-cols-4 md:gap-4">
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover-fine:group-hover/tile:scale-[1.06]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Pull quote ───────────────────────── */

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
