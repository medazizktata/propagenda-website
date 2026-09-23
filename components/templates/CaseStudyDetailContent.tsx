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
 * column-width as dead space on short galleries (explicit user direction, 2026-09-15). It's
 * also visitor-toggleable between that contained grid and a full-viewport "immersive" mode
 * (explicit user direction, 2026-09-18) — see the Expand/Compact view button.
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

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Maximize2, Minimize2 } from 'lucide-react';
import type {
  CaseStudyRecord,
  CaseStudyQuote,
  CaseStudyResult,
  GalleryImage,
} from '@/types/content';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/motion/gsap';
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
        // Composited from the moment the reveal is armed, and left that way. Unpromoted, every
        // frame of the move repaints the element — and the Story overview line carries a 40px
        // text-shadow over four lines of display type, so each frame the GPU re-rasterised
        // that blur (80 device px at DPR 2). That was the stutter scrolling from the Hero into
        // the overview on every case study: measured on a 120Hz display, ~23 dropped frames /
        // ~940ms of hitching per pass, all of it GPU-process time (the renderer main thread
        // had no long tasks at all). Promoted, the compositor just moves an already-rastered
        // texture: 1 drop / ~17ms. Promoting only at onStart left ~4 drops (the new layer's
        // first raster landed in the frame the motion began); clearing it on complete left ~2
        // (the demotion re-rasters the shadow into the page mid-scroll). Keeping it costs
        // ~3.3MB of GPU memory for the one overview line — cheap next to a visible stutter.
        item.style.willChange = 'transform';
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
        <CaseStudyGalleryMosaic
          images={gallery.slice(1)}
          canOpen={canOpen}
          onOpenAt={(i) => openAt(i + 1)}
          reducedMotion={reducedMotion}
        />
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
type EditorialRow = { images: GalleryImage[]; height: number; offsetLast: boolean };

// Not a uniform justified grid — a repeating editorial rhythm (one dominant shot, then a
// pair, then a triptych, then a pair, repeat) so the sequence reads as a curated spread
// instead of a conventional evenly-packed gallery (explicit user direction, 2026-09-18:
// "make the grid not conventional layout wise"). The count-per-row is fixed by the pattern,
// not by however many images happen to fit a target height — that's what makes it
// deliberate rather than incidental.
const ROW_PATTERN = [1, 2, 3, 2] as const;

/**
 * Each row's height is *solved*, not chosen from a target: given the row's fixed image
 * count and every one of those images' real aspect ratios, height is the one value that
 * makes them sum to exactly the container width. So a row never needs to crop or distort to
 * fit — width and height both fall out of the real aspect ratio together (explicit user
 * direction, 2026-09-15 or "not stretch the images inside", 2026-09-18). Height is clamped
 * against the viewport only as an outlier guard for one extreme-aspect image, not as the
 * normal case the way the old target-height masonry needed.
 */
function buildEditorialRows(images: GalleryImage[], containerWidth: number, gap: number, minH: number, maxH: number): EditorialRow[] {
  if (containerWidth <= 0) return [];
  const rows: EditorialRow[] = [];
  let i = 0;
  let patternIndex = 0;
  while (i < images.length) {
    const count = Math.min(ROW_PATTERN[patternIndex % ROW_PATTERN.length], images.length - i);
    const rowImages = images.slice(i, i + count);
    const aspectSum = rowImages.reduce((sum, img) => sum + (img.width / img.height || 1), 0);
    const rawHeight = (containerWidth - gap * (count - 1)) / aspectSum;
    const height = Math.min(Math.max(rawHeight, minH), maxH);
    // Broken-grid feel on multi-image rows: nudge every other tile down instead of a clean
    // top-aligned strip.
    rows.push({ images: rowImages, height, offsetLast: count > 1 && patternIndex % 2 === 1 });
    i += count;
    patternIndex += 1;
  }
  return rows;
}

function CaseStudyGalleryMosaic({
  images,
  canOpen,
  onOpenAt,
  reducedMotion,
}: {
  images: GalleryImage[];
  canOpen: boolean;
  onOpenAt: (i: number) => void;
  reducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const [vh, setVh] = useState(0);
  // Immersive is the default (explicit user direction, 2026-09-18: "for expand view, make
  // it default") — contained (page gutters, capped width) is the opt-out. Per-view state,
  // not persisted — a page reload always starts back at immersive.
  const [mode, setMode] = useState<'contained' | 'immersive'>('immersive');
  const immersive = mode === 'immersive';

  // Measured synchronously during commit (useLayoutEffect), before the browser's first
  // paint — not via ResizeObserver. A ResizeObserver's first callback fires on its own
  // async schedule shortly after mount, which on a case-study page landed right around the
  // visitor's first scroll off the Hero: it drove a re-render that rewrote flexGrow/height
  // inline styles on every tile below the fold, and that style write colliding with GSAP's
  // own per-tick getBoundingClientRect reads for the Hero's scrub animation is a textbook
  // layout-thrash pattern (write, then a forced synchronous read, then a dropped frame). It was
  // suspected as the Hero-into-overview stutter (2026-09-18) but was NOT it: that stutter was
  // measured (2026-09-23) as pure GPU cost from the overview line's reveal repainting its 40px
  // text-shadow every frame — see the .sd-reveal effect at the top of this file. Kept anyway:
  // a plain `resize` listener only fires on a real viewport change, never on its own schedule,
  // so it can't land mid-scroll by chance the way the observer could.
  const didMountRef = useRef(false);
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setWidth(el.getBoundingClientRect().width);
      setVh(window.innerHeight);
      // Row heights change substantially between contained and immersive (and on real
      // resizes) — the parallax ScrollTriggers below cache pixel start/end positions, so
      // they need telling the layout moved. But NOT on the very first (mount) call: a
      // page-wide ScrollTrigger.refresh() re-measures every trigger on the page (Hero's
      // scrub, every sd-reveal element, every parallax row) by reading real layout for each
      // one, and calling it unconditionally on mount put that one-time, genuinely expensive
      // synchronous pass right in the window where the visitor's first scroll off the Hero
      // was landing — a self-inflicted stutter, confirmed via a real frame-timing capture
      // (a ~950ms stall) that only showed up in a headed browser, not headless (explicit
      // user direction, 2026-09-18: "performance hit still happens... around scrolling to
      // this section"). On mount there's nothing stale to refresh yet — the triggers below
      // are freshly created with correct positions in the same pass. Deferred one frame so a
      // later refresh (an actual resize or mode toggle) reads the DOM after new heights
      // have committed and painted.
      if (didMountRef.current) {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
      didMountRef.current = true;
    };
    measure();

    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
    // Re-measures on `mode` too — toggling contained/immersive changes the container's own
    // width (it un-caps and drops the page gutters), and that new width needs picking up
    // immediately, not on the next incidental window resize.
  }, [mode]);

  const gap = width < 640 ? 12 : 16;
  // Contained keeps the old width-tier floor/ceiling; immersive's floor/ceiling key off
  // viewport height instead, so "fill the screen" actually means big, tall rows, not just
  // wider ones — a one-image row can run nearly the full viewport height.
  const minH = immersive ? Math.max(220, Math.round(vh * 0.32)) : width < 640 ? 140 : 200;
  const maxH = immersive ? Math.round(vh * 0.92) : width < 640 ? 260 : 460;
  const rows = buildEditorialRows(images, width, gap, minH, maxH);

  // One ScrollTrigger per ROW (not per tile) drives a contained parallax — each image is
  // rendered taller than its own clipped box and shifts within it as the row crosses the
  // viewport. This is the same shape of animation the Hero already uses safely (a plain
  // scrub tied to an element's own natural scroll range): no position:sticky, no pinned
  // wrapper, nothing structural — that combination was the actual root cause the last time
  // this page had real scroll jank, not scrub-linked motion itself. Grouping by row instead
  // of by tile also keeps the total trigger count low on a large gallery (added per explicit
  // user direction, 2026-09-18: "add parallax effect").
  //
  // `will-change: transform` is applied and removed on enter/leave (a generous +/-400px
  // margin so it lands before the row is actually visible), NOT set as a permanent class —
  // a real frame-timing capture (headed browser; headless didn't show it, since headless
  // rendering skips the real compositor cost) found a large, longtask-free stall here, which
  // is the signature of GPU/compositor cost rather than blocked JS. With immersive as the
  // new default, a gallery of 6-9 real photos each promoted to `will-change-transform`
  // unconditionally on mount means that many large GPU layers allocated at once, most of
  // them off-screen — exactly that cost. Scoping the promotion to only the row(s) actually
  // near the viewport keeps the concurrently-promoted layer count small regardless of how
  // many images the gallery has (explicit user direction, 2026-09-18).
  useEffect(() => {
    if (reducedMotion) return;
    const root = containerRef.current;
    if (!root) return;
    registerGsap();
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((rowEl) => {
        if (!rowEl) return;
        const imgs = rowEl.querySelectorAll<HTMLElement>('[data-parallax-img]');
        if (!imgs.length) return;
        const promote = () => imgs.forEach((img) => { img.style.willChange = 'transform'; });
        const demote = () => imgs.forEach((img) => { img.style.willChange = 'auto'; });
        gsap.fromTo(
          imgs,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: rowEl,
              start: 'top bottom+=400',
              end: 'bottom top-=400',
              scrub: true,
              onEnter: promote,
              onEnterBack: promote,
              onLeave: demote,
              onLeaveBack: demote,
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
    // Row *count* is stable across contained/immersive and across resizes (the editorial
    // pattern depends only on how many images there are, never on container width), so this
    // only needs to re-run when the actual image set changes.
  }, [reducedMotion, images]);

  // A flat running index so PhotoSwipe indices (into the un-rowed `images` array) stay correct.
  let flatIndex = 0;

  return (
    <section className="relative bg-charcoal py-20 lg:py-28">
      <div className="mx-auto mb-6 flex max-w-[110rem] items-center justify-end px-gutter-m lg:px-gutter-d">
        {/* No visible label — the grid is the page's dominant section and leads right after
            the Hero (explicit user direction), it doesn't need to announce itself as
            secondary "more" content. Kept as an sr-only heading for wayfinding/a11y. */}
        <h2 className="sr-only">Project visuals</h2>
        {/* Immersive (full viewport, big rows) is the default; contained is the opt-out back
            to the page-gutter grid — a visitor-toggleable choice, not a fixed layout
            (explicit user direction, 2026-09-18). */}
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'contained' ? 'immersive' : 'contained'))}
          aria-pressed={immersive}
          className={cn(
            'flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-sans text-sm font-medium text-white/70 transition-colors duration-300',
            'hover-fine:hover:border-white/30 hover-fine:hover:text-white',
            immersive && 'border-white/30 text-white',
          )}
        >
          {immersive ? <Minimize2 className="size-4" aria-hidden /> : <Maximize2 className="size-4" aria-hidden />}
          {immersive ? 'Compact view' : 'Expand view'}
        </button>
      </div>
      <div
        ref={containerRef}
        className={cn(
          'flex flex-col gap-3 transition-[padding] duration-300 md:gap-5',
          // True edge-to-edge in immersive mode — "fill out the entire screen", not a
          // slightly-wider contained grid, so no side padding at all here. w-full (not
          // w-screen) is enough and avoids w-screen's classic scrollbar-width overflow bug:
          // this section carries no horizontal padding of its own (unlike the header row
          // above it), so its full width already reaches the true viewport edges, same as
          // the Hero/Story sections' own full-bleed backgrounds.
          immersive ? 'w-full px-0' : 'mx-auto max-w-[110rem] px-gutter-m lg:px-gutter-d',
        )}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            ref={(el) => {
              rowRefs.current[ri] = el;
            }}
            className="flex gap-3 md:gap-5"
          >
            {row.images.map((image, ii) => {
              const i = flatIndex++;
              const tileWidth = row.height * ((image.width / image.height) || 1);
              // Every other tile on a multi-image row sits lower than its neighbours — a
              // broken, editorial skyline instead of a clean top-aligned strip (explicit
              // user direction, 2026-09-18: "make the grid not conventional layout wise").
              const dropped = row.offsetLast && ii % 2 === 1;
              return (
                <button
                  key={`${image.alt}-${i}`}
                  type="button"
                  onClick={canOpen ? () => onOpenAt(i) : undefined}
                  disabled={!canOpen}
                  aria-label={canOpen ? `Open image: ${image.alt}` : image.alt}
                  style={{
                    flexGrow: tileWidth,
                    flexBasis: 0,
                    height: row.height,
                    marginTop: dropped ? row.height * 0.08 : undefined,
                  }}
                  className={cn(
                    'group/tile relative block overflow-hidden rounded-xl bg-white/[0.03] text-left',
                    canOpen ? 'cursor-zoom-in' : 'cursor-default',
                  )}
                >
                  {/* Rendered ~26% taller than its own box and shifted by the parallax tween
                      above — the box itself is always sized to the image's real aspect
                      ratio (never stretched or distorted), the extra height is overscan so
                      the shift never reveals a gap at the top or bottom edge, the same
                      trade-off every parallax image on the web makes (explicit user
                      direction, 2026-09-18: "make sure to not stretch the images inside" —
                      read as never distort, not zero-crop, since a *contained* shift is
                      mechanically impossible without a little overscan).
                      No static will-change class here on purpose — it's toggled on the
                      element by the row's ScrollTrigger enter/leave callbacks above, only
                      while the row is actually near the viewport. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    data-parallax-img
                    className="absolute inset-x-0 -top-[13%] h-[126%] w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        ))}
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
