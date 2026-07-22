'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// The signature module for Websites — a live "launch preview". Rather than another select-a-row +
// crossfade panel (PR roster / marketing funnel / graphics bench), this is a single centred stage:
// a real browser window mock that the visitor resizes with a Desktop / Tablet / Mobile toggle. The
// framed mini-site genuinely reflows — its nav collapses and its card grid drops from three columns
// to one — so the page demonstrates responsive design by *being* responsive (devtools-style). Below
// it, a Lighthouse-style performance readout animates up when scrolled into view: one radial score
// gauge as the recognisable web-vitals motif plus a hairline figure strip. Scores and dimensions
// are illustrative placeholders; imagery is borrowed from the portfolio pool as stand-ins.

type Breakpoint = {
  id: 'desktop' | 'tablet' | 'mobile';
  label: string;
  width: string;
  dims: string;
  cols: number;
};

const BREAKPOINTS: Breakpoint[] = [
  { id: 'desktop', label: 'Desktop', width: '100%', dims: '1280 × 800', cols: 3 },
  { id: 'tablet', label: 'Tablet', width: '600px', dims: '768 × 1024', cols: 2 },
  { id: 'mobile', label: 'Mobile', width: '330px', dims: '375 × 812', cols: 1 },
];

// The mini-site rendered inside the frame — real portfolio renders as stand-in screenshots.
const HERO_IMG = '/images/portfolio/work-quickcars.png';
const SITE_CARDS = [
  { img: '/images/portfolio/work-sanapex.png', title: 'New arrivals' },
  { img: '/images/portfolio/work-ghaftree.png', title: 'Certified used' },
  { img: '/images/portfolio/work-restaurant.png', title: 'Finance & trade-in' },
];
const NAV_LINKS = ['Home', 'Models', 'Finance', 'Contact'];

// Supporting web-vitals figures beside the score gauge (all illustrative, all "good").
const VITALS = [
  { label: 'Accessibility', value: '100' },
  { label: 'SEO', value: '100' },
  { label: 'Largest paint', value: '1.1s' },
  { label: 'Layout shift', value: '0.01' },
];

/** Eased number tween 0 → target, run once. Reduced motion snaps to the final value. */
function useCountUp(target: number, run: boolean, reduced: boolean, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, reduced, duration]);
  return reduced ? target : val;
}

function DeviceIcon({ kind, className }: { kind: Breakpoint['id']; className?: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };
  if (kind === 'desktop') {
    return (
      <svg {...common}>
        <rect x="2" y="4" width="20" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    );
  }
  if (kind === 'tablet') {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M11 18h2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="7" y="2" width="10" height="20" rx="2.2" />
      <path d="M11 18h2" />
    </svg>
  );
}

// The recognisable Lighthouse-style score ring — one gauge, not a grid of identical rings.
function ScoreGauge({ score, run, reduced }: { score: number; run: boolean; reduced: boolean }) {
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const val = useCountUp(score, run, reduced);
  const filled = reduced || run;
  const offset = c * (1 - score / 100);
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Performance score ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f58b27"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={filled ? offset : c}
          style={{ transition: reduced ? undefined : 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans text-4xl font-bold tabular-nums text-white">{val}</span>
        <span className="text-xs text-white/45">Performance</span>
      </div>
    </div>
  );
}

export function WebsitesShowcase() {
  const [active, setActive] = useState(0);
  const bp = BREAKPOINTS[active];
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Fire the performance readout (ring + count-up) once, when it scrolls into view.
  const perfRef = useRef<HTMLDivElement>(null);
  const [perfInView, setPerfInView] = useState(false);
  useEffect(() => {
    const el = perfRef.current;
    if (!el || perfInView || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPerfInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [perfInView]);

  // 3D parallax tilt on the browser frame — pointer position drives rotateX/Y (desktop hover only).
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    const target = { rx: 0, ry: 0 };
    const cur = { rx: 0, ry: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      target.ry = x * 11;
      target.rx = -y * 9;
    };
    const onLeave = () => {
      target.rx = 0;
      target.ry = 0;
    };

    const tick = () => {
      cur.rx += (target.rx - cur.rx) * 0.075;
      cur.ry += (target.ry - cur.ry) * 0.075;
      tilt.style.transform = `translateZ(28px) rotateX(${cur.rx}deg) rotateY(${cur.ry}deg)`;
      raf = requestAnimationFrame(tick);
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      tilt.style.transform = '';
    };
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">The build</SectionLabel>
        <h2
          className="sd-reveal mb-4 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          See it at every size.
        </h2>
        <p className="sd-reveal mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-white/60 md:text-base">
          Every site we build is responsive by design and fast by default. Drag the view from
          desktop to mobile and watch the layout adapt — then see the performance behind it.
        </p>

        {/* ── Breakpoint toggle — resizes the browser stage below. ── */}
        <div className="sd-reveal mb-6 flex items-center justify-center">
          <div className="inline-flex gap-1 rounded-xl border border-white/12 bg-white/[0.03] p-1">
            {BREAKPOINTS.map((b, i) => {
              const on = active === i;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out',
                    on
                      ? 'bg-orange text-navy'
                      : 'text-white/55 hover-fine:hover:text-white',
                  )}
                >
                  <DeviceIcon kind={b.id} className="h-4 w-4" />
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Browser stage — 3D tilt follows cursor over desktop / tablet / mobile widths. ── */}
        <div
          ref={stageRef}
          className="sd-reveal flex h-[24rem] items-stretch justify-center [perspective:1400px] [perspective-origin:50%_42%] md:h-[32rem]"
        >
          <div
            ref={tiltRef}
            className="flex h-full w-full max-w-full items-stretch justify-center [transform-style:preserve-3d] will-change-transform"
          >
            <div
              className="h-full w-full transition-[max-width] duration-500 ease-out"
              style={{ maxWidth: bp.width }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
              {/* Chrome bar — traffic lights, address pill, live dimensions. */}
              <div className="flex shrink-0 items-center gap-3 border-b border-black/5 bg-[#eceff3] px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 ring-1 ring-black/[0.06]">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3 w-3 shrink-0 text-navy/40">
                    <rect x="5" y="11" width="14" height="9" rx="1.6" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="truncate text-[11px] text-navy/55">quickcars.ae</span>
                </div>
                <span className="hidden shrink-0 text-[11px] tabular-nums text-navy/40 sm:block">{bp.dims}</span>
              </div>

              {/* Viewport — a real mini-site that reflows by breakpoint (nav + hero + card grid). */}
              <div className="relative flex-1 overflow-hidden bg-white">
                {/* Site nav — collapses to a menu glyph at mobile width. */}
                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
                  <span className="font-sans text-sm font-bold tracking-tight text-navy">Quick Cars</span>
                  {bp.id === 'mobile' ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-navy/70">
                      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <ul className="flex items-center gap-4">
                      {NAV_LINKS.map((l, i) => (
                        <li
                          key={l}
                          className={cn('text-xs', i === 0 ? 'font-semibold text-orange' : 'text-navy/60')}
                        >
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Hero band. */}
                <div className="relative h-[42%] min-h-[7rem] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/35 to-transparent" />
                  <div className="absolute inset-x-4 bottom-3">
                    <p
                      className="font-sans font-bold leading-tight text-white"
                      style={{ fontSize: 'clamp(0.95rem, 2.4vw, 1.5rem)' }}
                    >
                      Find your next car.
                    </p>
                    <span className="mt-2 inline-block rounded bg-orange px-2.5 py-1 text-[10px] font-semibold text-navy">
                      Browse models
                    </span>
                  </div>
                </div>

                {/* Card grid — three columns on desktop, two on tablet, one on mobile. */}
                <div className="p-4">
                  <div
                    className="grid gap-3 transition-all duration-500 ease-out"
                    style={{ gridTemplateColumns: `repeat(${bp.cols}, minmax(0, 1fr))` }}
                  >
                    {SITE_CARDS.map((card) => (
                      <div key={card.title} className="overflow-hidden rounded-lg ring-1 ring-black/[0.06]">
                        <div className="relative aspect-[4/3]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={card.img} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="px-2.5 py-2">
                          <span className="block text-[11px] font-semibold text-navy">{card.title}</span>
                          <span className="mt-0.5 block h-1.5 w-2/3 rounded-full bg-black/[0.08]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ── Performance readout — Lighthouse-style, animates up on reveal. ── */}
        <div
          ref={perfRef}
          className="sd-reveal mt-12 grid gap-8 border-t border-white/10 pt-9 md:grid-cols-[auto_1fr] md:items-center md:gap-14"
        >
          <div className="flex items-center gap-6">
            <ScoreGauge score={98} run={perfInView} reduced={reducedMotion} />
            <div className="max-w-xs">
              <h3 className="font-sans text-xl font-bold tracking-tight text-white">Built to perform.</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                Fast, accessible, and search-ready on every device — measured against Core Web
                Vitals, not assumed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 pt-6 sm:grid-cols-4 sm:border-t-0 sm:pt-0">
            {VITALS.map((v, i) => (
              <div
                key={v.label}
                className={cn(
                  'px-1 py-2 sm:px-5',
                  i > 0 && 'sm:border-l sm:border-white/10',
                )}
              >
                <span className="block font-sans text-2xl font-bold tabular-nums text-white md:text-3xl">
                  {v.value}
                </span>
                <span className="mt-1 block text-sm text-white/45">{v.label}</span>
                <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-orange">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
                  Good
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
