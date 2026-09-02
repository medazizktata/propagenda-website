'use client';

import { useRef, useEffect, useState } from 'react';
import { designPrintInstall } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// The pool of real work samples a visitor can cycle through by clicking a card.
const WORK_IMAGES = [
  '/images/portfolio/work-sanapex.webp',
  '/images/portfolio/work-quickcars.webp',
  '/images/portfolio/work-food.webp',
  '/images/portfolio/work-events.webp',
  '/images/portfolio/work-ghaftree.webp',
  '/images/portfolio/work-restaurant.webp',
];

// A clickable work-sample image: clicking it CROSSFADES to the next sample (two stacked
// layers whose opacity we toggle), so the placeholder content can be swapped smoothly.
// Quality-of-life touch; independent of the scatter/break GSAP transforms on the card.
function WorkCardImage({ initial }: { initial: string }) {
  const [layers, setLayers] = useState<[string, string]>([initial, initial]);
  const [top, setTop] = useState<0 | 1>(0);
  const idxRef = useRef(Math.max(0, WORK_IMAGES.indexOf(initial)));

  const cycle = () => {
    idxRef.current = (idxRef.current + 1) % WORK_IMAGES.length;
    const next = WORK_IMAGES[idxRef.current];
    const hidden = top === 0 ? 1 : 0;
    setLayers((prev) => (hidden === 0 ? [next, prev[1]] : [prev[0], next]));
    setTop(hidden);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      // Decorative pointer-only easter egg: the cards overlap while the deck is piled
      // (failing target-size spacing) and six identical buttons are pure noise for
      // keyboard/screen-reader users — so it's presentational: no tab stop, no a11y node.
      tabIndex={-1}
      aria-hidden
      className="pointer-events-auto absolute inset-0 h-full w-full cursor-pointer transition duration-300 hover:brightness-110"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layers[0]}
        alt=""
        aria-hidden
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${top === 0 ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layers[1]}
        alt=""
        aria-hidden
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${top === 1 ? 'opacity-100' : 'opacity-0'}`}
      />
    </button>
  );
}

// SMV's "we draw." act (home page, steps 9→11), rendered in the Propagenda brand:
// a full-viewport interstitial where the giant statement holds in the centre and a
// cluster of media cards SCATTERS in around it (step 10), then — as you scroll to the
// next section — everything BREAKS APART: the cards fly outward and the words scatter
// (step 11). Statement stays orange-on-dark and legible; only the motion is scrolled.

// Organized resting layout — the deck resolves into a PRECISE, symmetric grid (two even
// columns of three that frame the statement), aligned and zero-rotation rather than
// scattered — it reads as a deliberate, put-together team.
// Offsets are a fraction of the viewport (x → vw, y → vh) so it stays proportional at any
// size; `grad` is a neutral charcoal→black tint (never navy).
type ScatterCard = { x: number; y: number; rot: number; w: number; grad: string; img: string };
const CARDS: ScatterCard[] = [
  { x: -33, y: -25, rot: 0, w: 15, grad: 'from-charcoal to-black', img: '/images/portfolio/work-sanapex.webp' },
  { x: -33, y: 0, rot: 0, w: 15, grad: 'from-black to-charcoal', img: '/images/portfolio/work-quickcars.webp' },
  { x: -33, y: 25, rot: 0, w: 15, grad: 'from-charcoal to-black', img: '/images/portfolio/work-events.webp' },
  { x: 33, y: -25, rot: 0, w: 15, grad: 'from-black to-charcoal', img: '/images/portfolio/work-food.webp' },
  { x: 33, y: 0, rot: 0, w: 15, grad: 'from-charcoal to-black', img: '/images/portfolio/work-restaurant.webp' },
  { x: 33, y: 25, rot: 0, w: 15, grad: 'from-black to-charcoal', img: '/images/portfolio/work-sanapex.webp' },
];

// The opening frame (SMV step 9): the cards begin STACKED like a deck near the centre —
// overlapping, each kicked a touch off-square — before they scatter out. Tiny x/y jitter
// (fraction of vw/vh) + small rotations read as a pile.
const STACK = [
  { x: -1.5, y: -1, rot: -8 },
  { x: 1.2, y: -2, rot: 6 },
  { x: -0.6, y: 1.4, rot: -3 },
  { x: 2, y: 0.6, rot: 11 },
  { x: -2, y: -0.6, rot: 4 },
  { x: 1.6, y: 2, rot: -6 },
];

// How much each word of the statement flings out on the break-apart (fraction of vw/vh).
const WORD_SCATTER = [
  { x: -17, y: -11, rot: -7 },
  { x: 2, y: 13, rot: 5 },
  { x: 20, y: -1, rot: 9 },
] as const;

export function DesignPrintInstallPopup({ flat = false }: { flat?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Mouse-move parallax on the card deck only (the ground stays flat and still).
  useEffect(() => {
    if (reducedMotion || flat) return;
    const cardsEl = cardsRef.current;
    if (!cardsEl) return;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      cardsEl.style.transform = `translate3d(${cur.x * 60}px, ${cur.y * 60}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, flat]);

  useEffect(() => {
    // `flat` (embedded /preview): no scroll-scrub. The deck is placed in its resting grid via
    // CSS vw/vh transforms (below) so it stays responsive when the iframe changes breakpoint,
    // and the statement + subline render at their default full opacity.
    if (!sectionRef.current || flat) return;
    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const ctx = gsap.context(() => {
      // Cards are anchored at the exact centre (left/top 50% + translate -50%); GSAP then
      // drives their scatter as px offsets, recomputed on refresh so it stays responsive.
      gsap.set('.dpi-card', { xPercent: -50, yPercent: -50 });

      if (reducedMotion) {
        // Compose the static scattered frame (no motion), everything visible.
        gsap.set('.dpi-card', {
          x: (i) => (vw() * CARDS[i].x) / 100,
          y: (i) => (vh() * CARDS[i].y) / 100,
          rotation: (i) => CARDS[i].rot,
          opacity: 1,
          scale: 1,
        });
        return;
      }

      // Seed the FIRST-FRAME (from) state deterministically for EVERY target up front.
      // A staggered fromTo's `immediateRender` only reliably initialises its first target;
      // the remaining staggered targets are left at their base/end state on the very first
      // paint (before the timeline is ever scrubbed). That is what stranded the act on a
      // fresh load: the deck showed un-stacked (only the first card piled) and PRINT/INSTALL
      // were already revealed at progress ~0. Setting the from-state explicitly here — and
      // running the reveal tweens with immediateRender:false (below) — guarantees the deck
      // is stacked and the words/subline are hidden until the scroll actually reaches them.
      gsap.set('.dpi-card', {
        x: (i) => (vw() * STACK[i].x) / 100,
        y: (i) => (vh() * STACK[i].y) / 100,
        rotation: (i) => STACK[i].rot,
        scale: 0.92,
        opacity: 1,
      });
      gsap.set('.dpi-word', { opacity: 0, yPercent: 60, x: 0, y: 0, rotation: 0 });
      gsap.set('.dpi-sub', { opacity: 0, yPercent: 45 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // STACKED DECK → SCATTER. The deck's stacked from-state is painted by the gsap.set
      // above and held only BRIEFLY (to 0.12) — the scatter then begins WHILE the section is
      // still scrolling in, before it locks centre-stage (lock ≈ progress 0.24). So the act
      // animates mid-transition instead of sitting inert until you're snapped in and scroll
      // further. `immediateRender:false` keeps this tween from re-seeding the from-state at
      // build time (that re-seed only initialised the first staggered card, stranding the
      // rest un-piled on first paint); the deterministic set above handles every card.
      tl.fromTo(
        '.dpi-card',
        {
          x: (i) => (vw() * STACK[i].x) / 100,
          y: (i) => (vh() * STACK[i].y) / 100,
          rotation: (i) => STACK[i].rot,
          scale: 0.92,
          opacity: 1,
        },
        {
          x: (i) => (vw() * CARDS[i].x) / 100,
          y: (i) => (vh() * CARDS[i].y) / 100,
          rotation: (i) => CARDS[i].rot,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 0.26,
          stagger: 0.035,
          immediateRender: false,
        },
        0.12,
      )
        // Statement rises in as the cards fan away (the pile parts to reveal the words).
        .fromTo(
          '.dpi-word',
          { opacity: 0, yPercent: 60, x: 0, y: 0, rotation: 0 },
          {
            opacity: 1,
            yPercent: 0,
            x: 0,
            y: 0,
            rotation: 0,
            ease: 'power2.out',
            duration: 0.24,
            stagger: 0.05,
            immediateRender: false,
          },
          0.16,
        )
        // BREAK APART — cards fly further out and FULLY FADE (opacity → 0) so the act
        // dissolves cleanly instead of leaving cards to be sliced by the section's
        // overflow edge at the boundary with the next section. The gap between in/out
        // (≈0.59→0.70) is the composed hold.
        // The subline is the closing payoff: it stays hidden through the deck + scatter and
        // is REVEALED last (once the cards have fanned out and the words have settled).
        .fromTo(
          '.dpi-sub',
          { opacity: 0, yPercent: 45 },
          { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.14, immediateRender: false },
          0.45,
        )
        .to(
          '.dpi-card',
          {
            x: (i) => (vw() * CARDS[i].x * 1.9) / 100,
            y: (i) => (vh() * CARDS[i].y * 1.9) / 100,
            rotation: (i) => CARDS[i].rot * 1.7,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.26,
            stagger: 0.02,
          },
          0.74,
        )
        .to(
          '.dpi-word',
          {
            x: (i) => (vw() * WORD_SCATTER[i].x) / 100,
            y: (i) => (vh() * WORD_SCATTER[i].y) / 100,
            rotation: (i) => WORD_SCATTER[i].rot,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.26,
            stagger: 0.03,
          },
          0.75,
        )
        // Everything (subline included) clears before the section seam so nothing is sliced.
        .to('.dpi-sub', { opacity: 0, ease: 'power1.in', duration: 0.18 }, 0.82);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, flat]);

  const words = designPrintInstall.headline.split('·').map((s) => s.trim());

  return (
    <section ref={sectionRef} data-seamless-act className={flat ? 'relative' : 'relative h-[320vh]'}>
      <div
        className={
          flat
            ? 'relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal'
            : 'sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-charcoal'
        }
      >
        {/* Scattered media cards (parallax layer, behind the statement so it stays legible). */}
        <div ref={cardsRef} className="pointer-events-none absolute inset-0 isolate will-change-transform">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="dpi-card absolute left-1/2 top-1/2 overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10 will-change-transform"
              style={{
                width: `clamp(10.5rem, ${card.w * 2.4}vw, ${card.w}vw)`,
                aspectRatio: '3 / 4',
                // Flat (preview): CSS stands in for the GSAP transform — centre the card, then
                // offset into its resting-grid slot in viewport units so it reflows on resize.
                ...(flat
                  ? { transform: `translate(-50%, -50%) translate(${card.x}vw, ${card.y}vh)` }
                  : null),
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.grad}`} />
              <WorkCardImage initial={card.img} />
              {/* Type is this act's protagonist — the deck reads as supporting cast, so every
                  card carries a quiet scrim that keeps the statement legible over it. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-charcoal/40" />
            </div>
          ))}
        </div>

        {/* Absolutely centered (optical) — raised above true midpoint so the stack
            reads as center-screen, each word squarely centered on the axis. */}
        <h2 className="pointer-events-none absolute left-1/2 top-[48%] flex w-full max-w-[100vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center font-sans font-bold uppercase leading-[0.82] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
          {words.map((word, i) => (
            <span
              key={word}
              className="dpi-word block w-full text-center text-white will-change-transform"
              style={{ fontSize: 'clamp(3rem, 12vw, 12rem)' }}
            >
              {word}
              {/* The verdict lands on the last word — orange full stop, the brand's period. */}
              {i === words.length - 1 && <span className="text-white">.</span>}
            </span>
          ))}
        </h2>

        {/* Subline — lifted off the viewport edge so it stays readable above the dock/chrome. */}
        <div className="dpi-sub pointer-events-none absolute inset-x-0 bottom-10 z-content flex items-center justify-center gap-4 px-6 will-change-[opacity] sm:bottom-12">
          <span aria-hidden className="hidden h-px w-8 shrink-0 bg-gradient-to-r from-transparent to-orange sm:block sm:w-14" />
          <span className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-white sm:text-sm">
            {designPrintInstall.subline}
          </span>
          <span aria-hidden className="hidden h-px w-8 shrink-0 bg-gradient-to-l from-transparent to-orange sm:block sm:w-14" />
        </div>
      </div>
    </section>
  );
}
