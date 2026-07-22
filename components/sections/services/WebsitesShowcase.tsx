'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  { id: 'tablet', label: 'Tablet', width: '420px', dims: '768 × 1024', cols: 2 },
  { id: 'mobile', label: 'Mobile', width: '260px', dims: '375 × 812', cols: 1 },
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

/** Mini-site that reflows inside the device screen. */
function MiniSite({ bp }: { bp: Breakpoint }) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-3 py-2.5 sm:px-4 sm:py-3">
        <span className="font-sans text-sm font-bold tracking-tight text-navy">Quick Cars</span>
        {bp.id === 'mobile' ? (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-navy/70">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <ul className="flex items-center gap-3 sm:gap-4">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l}
                className={cn('text-[10px] sm:text-xs', i === 0 ? 'font-semibold text-orange' : 'text-navy/60')}
              >
                {l}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative h-[42%] min-h-[6.5rem] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/35 to-transparent" />
        <div className="absolute inset-x-3 bottom-2.5 sm:inset-x-4 sm:bottom-3">
          <p
            className="font-sans font-bold leading-tight text-white"
            style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1.4rem)' }}
          >
            Find your next car.
          </p>
          <span className="mt-1.5 inline-block rounded bg-orange px-2 py-0.5 text-[9px] font-semibold text-navy sm:mt-2 sm:px-2.5 sm:py-1 sm:text-[10px]">
            Browse models
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
        <div
          className="grid gap-2.5 transition-all duration-500 ease-out sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${bp.cols}, minmax(0, 1fr))` }}
        >
          {SITE_CARDS.map((card) => (
            <div key={card.title} className="overflow-hidden rounded-lg ring-1 ring-black/[0.06]">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="px-2 py-1.5 sm:px-2.5 sm:py-2">
                <span className="block truncate text-[10px] font-semibold text-navy sm:text-[11px]">{card.title}</span>
                <span className="mt-0.5 block h-1.5 w-2/3 rounded-full bg-black/[0.08]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrowserChrome({ dims }: { dims: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-black/5 bg-[#eceff3] px-3 py-2 sm:gap-3 sm:px-3.5 sm:py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2 py-1 ring-1 ring-black/[0.06]">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3 w-3 shrink-0 text-navy/40">
          <rect x="5" y="11" width="14" height="9" rx="1.6" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="truncate text-[10px] text-navy/55 sm:text-[11px]">quickcars.ae</span>
      </div>
      <span className="hidden shrink-0 text-[10px] tabular-nums text-navy/40 sm:block sm:text-[11px]">{dims}</span>
    </div>
  );
}

/** Shared bezel — one morphing shell; radius / chrome / stand ease with the width resize. */
const BEZEL = 'bg-[#3a404c] ring-1 ring-white/30 shadow-[0_28px_70px_-28px_rgba(0,0,0,0.9)]';
const BEZEL_SOLID = 'bg-[#3a404c]';
const MORPH = 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';

function DeviceMockup({ bp, children, reduced }: { bp: Breakpoint; children: ReactNode; reduced: boolean }) {
  const isDesktop = bp.id === 'desktop';
  const isTablet = bp.id === 'tablet';
  const isMobile = bp.id === 'mobile';
  const ease = reduced ? '' : MORPH;

  return (
    <div className={cn('relative flex h-full w-full flex-col items-center', ease)}>
      {/* Outer bezel */}
      <div
        className={cn(
          'relative flex min-h-0 w-full flex-1 flex-col',
          BEZEL,
          ease,
          isDesktop && 'rounded-[1.1rem] p-2.5 sm:rounded-2xl sm:p-3',
          isTablet && 'rounded-[1.6rem] p-3 sm:rounded-[1.85rem] sm:p-3.5',
          isMobile && 'rounded-[2.1rem] p-2 sm:rounded-[2.35rem] sm:p-2.5',
        )}
      >
        {/* Tablet camera */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-1/2 top-5 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/35',
            ease,
            isTablet ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Phone side buttons */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -right-[3px] top-24 h-11 w-[3px] rounded-r',
            BEZEL_SOLID,
            ease,
            isMobile ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -left-[3px] top-20 h-7 w-[3px] rounded-l',
            BEZEL_SOLID,
            ease,
            isMobile ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -left-[3px] top-32 h-10 w-[3px] rounded-l',
            BEZEL_SOLID,
            ease,
            isMobile ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Screen well */}
        <div
          className={cn(
            'relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white',
            ease,
            isDesktop && 'rounded-lg sm:rounded-xl',
            isTablet && 'rounded-[1.15rem] sm:rounded-[1.35rem]',
            isMobile && 'rounded-[1.65rem] sm:rounded-[1.85rem]',
          )}
        >
          {/* Phone Dynamic Island */}
          <div
            className={cn(
              'relative flex shrink-0 items-center justify-center overflow-hidden',
              ease,
              isMobile ? 'h-7 opacity-100' : 'h-0 opacity-0',
            )}
          >
            <span aria-hidden className="h-3.5 w-14 rounded-full bg-[#1a1e26]" />
          </div>

          {/* Browser chrome — fades out on phone */}
          <div
            className={cn(
              'shrink-0 overflow-hidden',
              ease,
              isMobile ? 'max-h-0 opacity-0' : 'max-h-14 opacity-100',
            )}
          >
            <BrowserChrome dims={bp.dims} />
          </div>

          {children}

          {/* Phone home indicator */}
          <div
            className={cn(
              'flex shrink-0 items-center justify-center overflow-hidden',
              ease,
              isMobile ? 'h-4 opacity-100' : 'h-0 opacity-0',
            )}
          >
            <span aria-hidden className="h-1 w-20 rounded-full bg-black/20" />
          </div>
        </div>

        {/* Tablet home bar (below screen, in bezel) */}
        <span
          aria-hidden
          className={cn(
            'mx-auto block rounded-full bg-white/30',
            ease,
            isTablet ? 'mt-2.5 h-1 w-10 opacity-100' : 'mt-0 h-0 w-0 opacity-0',
          )}
        />
      </div>

      {/* Desktop stand */}
      <div
        className={cn(
          'flex flex-col items-center overflow-hidden',
          ease,
          isDesktop ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <span aria-hidden className={cn('h-3 w-16 sm:h-4 sm:w-20', BEZEL_SOLID)} />
        <span
          aria-hidden
          className={cn('h-1.5 w-36 rounded-full ring-1 ring-white/25 sm:w-44', BEZEL_SOLID)}
        />
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
        <p className="sd-reveal mb-8 max-w-xl text-[0.95rem] leading-relaxed text-white/60 md:text-base">
          Responsive by design, fast by default. Switch the view and watch the layout adapt.
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

        {/* ── Device stage — monitor / tablet / phone shell around the responsive mini-site. ── */}
        <div
          ref={stageRef}
          className="sd-reveal flex h-[26rem] items-stretch justify-center [perspective:1400px] [perspective-origin:50%_42%] md:h-[34rem]"
        >
          <div
            ref={tiltRef}
            className="flex h-full w-full max-w-full items-stretch justify-center [transform-style:preserve-3d] will-change-transform"
          >
            <div
              className={cn(
                'h-full w-full will-change-[max-width]',
                !reducedMotion && 'transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                bp.id === 'desktop' && 'pb-1',
              )}
              style={{ maxWidth: bp.width }}
            >
              <DeviceMockup bp={bp} reduced={!!reducedMotion}>
                <MiniSite bp={bp} />
              </DeviceMockup>
            </div>
          </div>
        </div>

        {/* ── Performance readout — score + vitals as one band under the device. ── */}
        <div
          ref={perfRef}
          className="sd-reveal mt-14 border-t border-white/10 pt-10"
        >
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex shrink-0 flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <ScoreGauge score={98} run={perfInView} reduced={reducedMotion} />
              <div className="max-w-[16rem]">
                <h3 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Built to perform.
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                  Fast and search-ready on every device — Core Web Vitals, not assumptions.
                </p>
              </div>
            </div>

            <div className="grid w-full flex-1 grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-4">
              {VITALS.map((v) => (
                <div
                  key={v.label}
                  className="flex flex-col bg-charcoal px-4 py-5 sm:px-5 sm:py-6"
                >
                  <span className="font-sans text-2xl font-bold tabular-nums text-white md:text-3xl">
                    {v.value}
                  </span>
                  <span className="mt-1 text-xs text-white/45 sm:text-sm">{v.label}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
                    Good
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
