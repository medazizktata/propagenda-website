'use client';

/*
 * THESIS: A tight, confident case-study read — asset-forward throughout, not just hero and
 * a closing mosaic — that reaches its end without excessive scrolling. Density breathes
 * (dense image, quiet type, dense again); scroll length tracks real content, not gimmicks.
 * OWN-WORLD: inherits exactly — Poppins display and body voice throughout (no mono/tracked
 * "backstage label" look anywhere in this file), black + #f58b27 orange as punctuation only,
 * near-black `ink` on orange (never white-on-orange), no kicker labels, no same-size cards.
 * VISUALS: the Mosaic is a justified-row layout (real aspect ratios pack rows that fill the
 * container width exactly), not CSS-column masonry — columns gave a horizontal image far
 * less height than a vertical neighbour in the column next to it, and also stranded unused
 * column-width as dead space on short galleries (explicit user direction, 2026-09-15).
 * STORY: gallery[0] duplicates heroImage by design (not a bug); Mosaic starts at gallery[1]
 * (the single-image Feature Image stop was folded into the mosaic outright — one visuals
 * grid, minimal text, per explicit user direction). "What we delivered" was removed
 * entirely, same direction. Results dropped the hero-metric template: one uniform-scale
 * flowing line, no giant figure over a small label. Quote grounds itself in the study's own
 * heroImage, with --sd-accent-on used on the attribution tag.
 * MOTION (2026-09-15, explicit user direction after a real scroll-jank investigation that
 * ruled parallax itself in/out via A/B-disabling every scroll-linked effect on this page —
 * see TASK notes): Hero is the ONLY section that carries scroll-linked parallax. Story's
 * backdrop and the Mosaic's per-tile shift are both now plain static backgrounds/images —
 * no GSAP ScrollTrigger, no sticky-tracked scale. Don't reintroduce scroll-linked motion to
 * any section below the Hero without raising it again first.
 * FIRST VIEWPORT: hero unchanged in content — full-bleed heroImage or pattern fallback.
 * FORM: plain Poppins hierarchy and real accent color, not tracked-mono labels or filler.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
 * review, the verdict, and DESIGN.md.
 */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import type {
  CaseStudyRecord,
  CaseStudyQuote,
  CaseStudyResult,
  GalleryImage,
} from '@/types/content';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { WorkNextPrev } from '@/components/sections/WorkNextPrev';
import { ScrollCue } from '@/components/molecules/ScrollCue';
import { PhotoSwipeLightbox } from '@/components/PhotoSwipeLightbox';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';

interface CaseStudyDetailContentProps {
  study: CaseStudyRecord;
  prevStudy?: CaseStudyRecord;
  nextStudy?: CaseStudyRecord;
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

export function CaseStudyDetailContent({
  study,
  prevStudy,
  nextStudy,
}: CaseStudyDetailContentProps) {
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
          // Cuberto-style long settle (translate-only stays anti-blank).
          y: 56,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const meta = [study.industry, study.year].filter((v): v is string => Boolean(v));

  const prev = prevStudy;
  const next = nextStudy;

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

      {/* Story — a single overview line over a static brand backdrop (Hero is the only
          section that carries scroll-linked parallax). A short text beat before the
          grid, not after (explicit user direction, 2026-09-15). */}
      <CaseStudyStory study={study} overview={study.overview} />

      {/* Visuals grid — the dominant section of the whole page (explicit user direction,
          2026-09-15: "make the grid the most dominant thing in a project showcase"),
          expanded well past the old "More visuals" afterthought treatment. Comes right
          after the one text beat above, not before it. */}
      {gallery.length > 1 && (
        <CaseStudyGalleryMosaic images={gallery.slice(1)} canOpen={canOpen} onOpenAt={(i) => openAt(i + 1)} />
      )}

      <CaseStudyResults results={study.results} />

      {study.quote && <CaseStudyQuoteBlock quote={study.quote} heroImage={study.heroImage} />}

      <WorkNextPrev prev={prev} next={next} />

      {canOpen && <PhotoSwipeLightbox images={openable} isOpen={isOpen} initialIndex={index} onClose={close} />}
    </div>
  );
}

/* ───────────────────────── Hero (scroll-linked scale) ───────────────────────── */

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

  // Every study's title follows "Client Name: Category of work" (e.g. "Quick Cars:
  // Branding & Visual Identity") — split on the first colon so the brand name can lead
  // big and the category reads as a plain sub-line, instead of one long run-on heading.
  // Split study.title (proper case), not study.h1 (already all-caps in the data) — the
  // sub-line stays natural case rather than shouting.
  const colonIndex = study.title.indexOf(':');
  const titleName = colonIndex === -1 ? study.title : study.title.slice(0, colonIndex).trim();
  const titleCategory = colonIndex === -1 ? null : study.title.slice(colonIndex + 1).trim();

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;
    registerGsap();
    const ctx = gsap.context(() => {
      // Scroll-linked, not pinned: the scale/fade rides the section's own natural height
      // instead of locking the viewport and padding the page with extra scroll distance.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.to(imgRef.current, { scale: 1.1, ease: 'none' }, 0).to(
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

            {/* Brand name leads, big; the category of work follows as a plain sub-line —
                simpler than one long run-on title (study.title stays "Name: Category" in
                the data for SEO/lists; this is the only place it's split for display). */}
            <h1
              className="max-w-5xl text-balance font-sans font-bold uppercase leading-[0.94] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}
            >
              {titleName}
              <span className="text-[color:var(--sd-accent)]">.</span>
            </h1>
            {titleCategory && (
              <p
                className="mt-3 max-w-2xl font-sans font-medium text-white/75"
                style={{ fontSize: 'clamp(1.05rem, 2vw, 1.5rem)' }}
              >
                {titleCategory}
              </p>
            )}

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

/* ───────────── Story (sticky backdrop, one compact editorial pass) ───────────── */

// A full-screen brand backdrop stays sticky behind the overview and the narrative beats,
// but the beats no longer each claim a near-full viewport of scroll: they sit together as
// one dense editorial pass (overview, then a compact problem/approach/result row), so the
// backdrop's parallax length tracks the real content instead of padding the page.
// Text-only studies use the monogram + an orange glow as the backdrop instead of a photo.
function CaseStudyStory({
  study,
  overview,
}: {
  study: CaseStudyRecord;
  overview: string;
}) {
  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-charcoal">
      {/* Normal (non-parallax) backdrop — the Hero above is the one section that carries
          scroll-linked motion; every later section is a plain static background. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {study.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={study.heroImage} alt="" className="h-full w-full object-cover object-center" />
        ) : (
          <BrandPattern variant="dense" half="right" className="opacity-[0.45]" />
        )}
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/75" />
        <div className="absolute -right-[8%] top-1/4 h-[55%] w-[45%] rounded-full bg-[color:var(--sd-accent)] opacity-[0.13] blur-[140px]" />
      </div>

      {/* One hook line, nothing else — the challenge/approach/outcome breakdown was removed
          outright (2026-09-15, explicit user direction: "reduce text drastically... very
          minimal text across all projects"). The visuals carry the rest of the story now. */}
      <div className="relative z-content px-gutter-m py-28 lg:px-gutter-d lg:py-36">
        <p
          className="sd-reveal mx-auto w-full max-w-5xl font-sans font-semibold leading-[1.15] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.75)]"
          style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.9rem)' }}
        >
          {overview}
        </p>
      </div>
    </section>
  );
}

/* ───────────── Results (only when a study has real numbers) ───────────── */

// Deliverables removed outright (2026-09-15, explicit user direction: "too much text, remove
// what we delivered completely") — a text list was never earning its section here. Results
// keeps its own quiet beat when a study actually has real numbers.
function CaseStudyResults({ results }: { results?: CaseStudyResult[] }) {
  const hasResults = Boolean(results && results.length > 0);
  if (!hasResults) return null;

  // Uniform scale throughout, one flowing line — not the banned hero-metric template
  // (a giant figure over a small label, plus a row of smaller supporting stat tiles).
  // Real client numbers stay legible without a manufactured size hierarchy between them.
  const list = results ?? [];

  return (
    <section className="relative border-y border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-[10%] top-1/2 h-[60%] w-[40%] -translate-y-1/2 rounded-full bg-[color:var(--sd-accent)] opacity-[0.08] blur-[130px]" />
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionHeading>Results</SectionHeading>

        <p className="sd-reveal max-w-2xl font-sans leading-relaxed text-white/85" style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.6rem)' }}>
          {list.map((r, i) => (
            <span key={r.label}>
              <span className="font-extrabold text-[color:var(--sd-accent)]">{r.value}</span>{' '}
              <span className="text-white/70">{r.label}</span>
              {i < list.length - 1 ? <span aria-hidden className="text-white/30"> · </span> : null}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Visuals grid (real work, shown large, minimal text) ───────────────────────── */

/** One packed row: the images it holds, plus the shared height every one of them renders at. */
type JustifiedRow = { images: GalleryImage[]; height: number };

/**
 * Flickr/Google-Photos-style justified layout: pack images into rows at a target height, then
 * stretch (or, capped, shrink) each row's height so its images' *own* aspect ratios exactly
 * fill the container width — no cropping, because width and height both scale together from
 * the real aspect ratio (unlike CSS-column masonry, where each column has one fixed width and
 * a horizontal image in it renders far shorter than a vertical neighbour in the column next to
 * it — explicit user direction, 2026-09-15: "horizontal images have less height than the
 * vertical one, images should match the height and scale images dynamically"). The final,
 * incomplete row is left at the target height rather than stretched, so a lone last image
 * doesn't get blown up to fill the row by itself.
 */
function computeJustifiedRows(images: GalleryImage[], containerWidth: number, targetHeight: number, gap: number): JustifiedRow[] {
  if (containerWidth <= 0) return [];
  const rows: JustifiedRow[] = [];
  let rowImages: GalleryImage[] = [];
  let aspectSum = 0;

  for (const image of images) {
    const aspect = image.width / image.height || 1;
    rowImages.push(image);
    aspectSum += aspect;
    const widthAtTarget = aspectSum * targetHeight + gap * (rowImages.length - 1);
    if (widthAtTarget >= containerWidth) {
      const rawHeight = (containerWidth - gap * (rowImages.length - 1)) / aspectSum;
      // Clamp so one extreme-aspect image can't force a row absurdly short or tall.
      const height = Math.min(Math.max(rawHeight, targetHeight * 0.55), targetHeight * 1.6);
      rows.push({ images: rowImages, height });
      rowImages = [];
      aspectSum = 0;
    }
  }
  if (rowImages.length > 0) {
    rows.push({ images: rowImages, height: targetHeight });
  }
  return rows;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gap = width < 640 ? 12 : 16;
  const targetHeight = width < 640 ? 200 : width < 1024 ? 260 : 340;
  const rows = computeJustifiedRows(images, width, targetHeight, gap);

  // A flat running index so PhotoSwipe indices (into the un-rowed `images` array) stay correct.
  let flatIndex = 0;

  return (
    <section className="relative bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div className="mx-auto max-w-[110rem]">
        {/* No visible label — the grid is the page's dominant section and leads right after
            the Hero (explicit user direction), it doesn't need to announce itself as
            secondary "more" content. Kept as an sr-only heading for wayfinding/a11y. */}
        <h2 className="sr-only">Project visuals</h2>
        <div ref={containerRef} className="flex flex-col gap-3 md:gap-4">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-3 md:gap-4">
              {row.images.map((image) => {
                const i = flatIndex++;
                const tileWidth = row.height * ((image.width / image.height) || 1);
                return (
                  <button
                    key={`${image.alt}-${i}`}
                    type="button"
                    onClick={canOpen ? () => onOpenAt(i) : undefined}
                    disabled={!canOpen}
                    aria-label={canOpen ? `Open image: ${image.alt}` : image.alt}
                    style={{ flexGrow: tileWidth, flexBasis: 0, height: row.height }}
                    className={cn(
                      'group/tile sd-reveal block overflow-hidden rounded-xl bg-white/[0.03] text-left',
                      canOpen ? 'cursor-zoom-in' : 'cursor-default',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover-fine:group-hover/tile:scale-[1.03]"
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Cinematic pull quote ───────────────────────── */

function CaseStudyQuoteBlock({ quote, heroImage }: { quote: CaseStudyQuote; heroImage?: string }) {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      {/* Ground the quote in the real work rather than a generic mark repeated on every
          client's page — desaturated and dimmed so it stays a backdrop, not a picture. */}
      {heroImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.16] grayscale">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <BrandPattern variant="tiled" />
        </div>
      )}
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
        <figcaption className="sd-reveal mt-8 flex items-center justify-center gap-3 text-base font-medium text-white/70">
          <span
            aria-hidden
            className="rounded-full px-3 py-1 font-sans text-sm font-semibold text-[color:var(--sd-accent-on)]"
            style={{ backgroundColor: 'var(--sd-accent)' }}
          >
            {quote.author}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
