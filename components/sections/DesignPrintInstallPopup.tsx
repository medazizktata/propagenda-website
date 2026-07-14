'use client';

import { useRef, useEffect, useState } from 'react';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { cn } from '@/components/ui/cn';
import { designPrintInstall } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// The pool of real work samples a visitor can cycle through by clicking a card.
const WORK_IMAGES = [
  '/images/portfolio/work-sanapex.png',
  '/images/portfolio/work-quickcars.png',
  '/images/portfolio/work-food.png',
  '/images/portfolio/work-events.png',
  '/images/portfolio/work-ghaftree.png',
  '/images/portfolio/work-restaurant.png',
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
      aria-label="Show another work sample"
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

// Scattered resting layout — offsets are a fraction of the viewport (x → vw, y → vh),
// so the cluster stays proportional at any size. `video` marks the one live showreel
// card (SMV's central portrait); the rest are brand placeholders (fill with real work
// later). `grad` tints each placeholder so the cluster reads as distinct pieces.
type ScatterCard = { x: number; y: number; rot: number; w: number; grad: string; video?: boolean; img?: string };
// Bottom-row cards (indices 3/5/6) sit a little higher than the true edges so they clear
// the subline band at the very bottom of the act (no overlap).
const CARDS: ScatterCard[] = [
  { x: -34, y: -24, rot: -11, w: 15, grad: 'from-navy via-charcoal to-black', img: '/images/portfolio/work-sanapex.png' },
  { x: -3, y: -31, rot: 7, w: 14, grad: 'from-charcoal via-navy to-black', img: '/images/portfolio/work-quickcars.png' },
  { x: 33, y: -22, rot: 10, w: 15, grad: 'from-black via-charcoal to-navy', img: '/images/portfolio/work-food.png' },
  { x: -32, y: 12, rot: 8, w: 14, grad: 'from-navy to-charcoal', img: '/images/portfolio/work-events.png' },
  { x: 4, y: 4, rot: -5, w: 18, video: true, grad: 'from-charcoal to-black' },
  { x: -7, y: 20, rot: -9, w: 14, grad: 'from-black to-navy', img: '/images/portfolio/work-ghaftree.png' },
  { x: 33, y: 16, rot: -11, w: 15, grad: 'from-charcoal via-black to-navy', img: '/images/portfolio/work-restaurant.png' },
];

// The opening frame (SMV step 9): the cards begin STACKED like a deck near the centre —
// overlapping, each kicked a touch off-square, the live card squared-up on top — before
// they scatter out. Tiny x/y jitter (fraction of vw/vh) + small rotations read as a pile.
const STACK = [
  { x: -1.5, y: -1, rot: -8 },
  { x: 1.2, y: -2, rot: 6 },
  { x: -0.6, y: 1.4, rot: -3 },
  { x: 2, y: 0.6, rot: 11 },
  { x: 0, y: 0, rot: 0 }, // the live showreel card — squared-up, sits on top of the pile
  { x: -2, y: -0.6, rot: 4 },
  { x: 1.6, y: 2, rot: -6 },
];

// How much each word of the statement flings out on the break-apart (fraction of vw/vh).
const WORD_SCATTER = [
  { x: -17, y: -11, rot: -7 },
  { x: 2, y: 13, rot: 5 },
  { x: 20, y: -1, rot: 9 },
] as const;

export function DesignPrintInstallPopup() {
  const sectionRef = useRef<HTMLElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Mouse-move parallax: section pattern drifts lightly, cards drift more.
  useEffect(() => {
    if (reducedMotion) return;
    const patternEl = patternRef.current;
    const cardsEl = cardsRef.current;
    if (!patternEl || !cardsEl) return;
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
      patternEl.style.transform = `translate3d(${cur.x * 30}px, ${cur.y * 30}px, 0)`;
      cardsEl.style.transform = `translate3d(${cur.x * 60}px, ${cur.y * 60}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current) return;
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
  }, [reducedMotion]);

  const words = designPrintInstall.headline.split('·').map((s) => s.trim());

  return (
    <section ref={sectionRef} data-seamless-act className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-charcoal">
        <div className="pattern-section-fade pointer-events-none absolute inset-0">
          <div ref={patternRef} className="absolute -inset-[8%] will-change-transform">
            <BrandPattern variant="dense" id="dpi" half="right" className="opacity-20" />
          </div>
        </div>

        {/* Scattered media cards (parallax layer, behind the statement so it stays legible). */}
        <div ref={cardsRef} className="pointer-events-none absolute inset-0 will-change-transform">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="dpi-card absolute left-1/2 top-1/2 overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10 will-change-transform"
              style={{ width: `${card.w}vw`, aspectRatio: '3 / 4', zIndex: card.video ? 2 : 1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.grad}`} />
              {card.video ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/videos/hero-placeholder.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden
                />
              ) : (
                /* Real client work (temporary fill) — click a card to crossfade to another. */
                <WorkCardImage initial={card.img ?? WORK_IMAGES[0]} />
              )}
            </div>
          ))}
        </div>

        {/* Absolutely centered (optical) — raised above true midpoint so the stack
            reads as center-screen, each word squarely centered on the axis. */}
        <h2 className="pointer-events-none absolute left-1/2 top-[48%] z-content flex w-full max-w-[100vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center font-sans font-bold uppercase leading-[0.82] tracking-tight text-orange">
          {words.map((word, i) => (
            <span
              key={word}
              className={cn('dpi-word block w-full text-center will-change-transform', i === 1 && 'text-white')}
              style={{ fontSize: 'clamp(3rem, 12vw, 12rem)' }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Subline — lifted off the viewport edge so it stays readable above the dock/chrome. */}
        <div className="dpi-sub pointer-events-none absolute inset-x-0 bottom-10 z-content flex items-center justify-center gap-4 px-6 will-change-[opacity] sm:bottom-12">
          <span aria-hidden className="hidden h-px w-8 shrink-0 bg-gradient-to-r from-transparent to-orange sm:block sm:w-14" />
          <span className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-white/80 sm:text-sm">
            {designPrintInstall.subline}
          </span>
          <span aria-hidden className="hidden h-px w-8 shrink-0 bg-gradient-to-l from-transparent to-orange sm:block sm:w-14" />
        </div>
      </div>
    </section>
  );
}
