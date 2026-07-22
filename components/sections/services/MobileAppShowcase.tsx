'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '@/components/ui/cn';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// The signature module for Mobile Applications. Websites already owns the "device that resizes"
// idea (a browser window with a Desktop/Tablet/Mobile toggle + Lighthouse gauge), so this makes a
// deliberately different point: how the APP ITSELF gets built. The section PINS, and scroll scrubs
// through the mobile design workflow — Discover → Design → Prototype → Build → Ship. As each stage
// lands, the phone advances to the screen that stage produces: it opens on a wireframe of the first
// launch, gains its real UI, then walks the live flow (home → detail → confirmation). An iOS ⇄
// Android toggle swaps the native chrome (status-bar clock side, header alignment, tab bar, home
// indicator vs system nav, the Android FAB) so the same screens prove they feel at home on both.
// Reduced motion falls back to a static, fully readable version — every stage listed, the phone on
// one finished screen. App content and imagery are illustrative placeholders from the portfolio.

type Platform = 'ios' | 'android';
type ScreenId = 'onboarding' | 'home' | 'detail' | 'order';

interface Stage {
  name: string;
  screen: ScreenId;
  /** Discover shows the first-launch screen as a low-fidelity wireframe. */
  wire?: boolean;
  detail: string;
}

// The workflow the scroll scrubs through. Each stage maps to the phone screen it produces, so the
// mockup visibly advances: wireframe → designed onboarding → home → detail → confirmation.
const STAGES: Stage[] = [
  {
    name: 'Discover',
    screen: 'onboarding',
    wire: true,
    detail: 'Goals, platforms, and the flows that matter.',
  },
  {
    name: 'Design',
    screen: 'onboarding',
    detail: 'Wireframes to native UI — type, colour, one clear action.',
  },
  {
    name: 'Prototype',
    screen: 'home',
    detail: 'Tappable flows, tested before we write production code.',
  },
  {
    name: 'Build',
    screen: 'detail',
    detail: 'Live data, secure APIs, a primary action on every screen.',
  },
  {
    name: 'Ship',
    screen: 'order',
    detail: 'Store submission, release, and support as you grow.',
  },
];

const CATEGORIES = ['Popular', 'Grills', 'Healthy', 'Dessert'];
const DISHES = [
  { img: '/images/portfolio/work-food.png', name: 'Truffle burger', place: 'Grill House', time: '25 min', rating: '4.9' },
  { img: '/images/portfolio/work-restaurant.png', name: 'Sunday roast', place: 'The Table', time: '35 min', rating: '4.8' },
  { img: '/images/portfolio/work-ghaftree.png', name: 'Garden bowl', place: 'Ghaf Tree', time: '20 min', rating: '4.7' },
  { img: '/images/portfolio/work-food.png', name: 'Spiced lamb wrap', place: 'Souk Kitchen', time: '22 min', rating: '4.8' },
  { img: '/images/portfolio/work-restaurant.png', name: 'Sea bass ceviche', place: 'The Table', time: '28 min', rating: '4.6' },
];

function scrollAmountForStage(stage: Stage, frac: number) {
  if (stage.screen === 'home') return frac * 128;
  if (stage.screen === 'detail') return frac * 108;
  if (stage.screen === 'onboarding' && !stage.wire) return frac * 36;
  if (stage.wire) return frac * 24;
  return 0;
}
const FEATURE = DISHES[0];

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
];

/* ── Small line glyphs ─────────────────────────────────────────────────── */

const svg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function Glyph({ kind, className }: { kind: string; className?: string }) {
  switch (kind) {
    case 'search':
      return (
        <svg {...svg} className={className}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'home':
      return (
        <svg {...svg} className={className}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...svg} className={className}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case 'user':
      return (
        <svg {...svg} className={className}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...svg} className={className}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...svg} className={className}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'check':
      return (
        <svg {...svg} className={className}>
          <path d="M4 12.5 9.5 18 20 6" strokeWidth="2.2" />
        </svg>
      );
    case 'dots':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      );
    case 'image':
      return (
        <svg {...svg} className={className}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="m4 18 5-5 4 3 3-2 4 4" />
        </svg>
      );
    default:
      return null;
  }
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.9 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" />
    </svg>
  );
}

// Status-bar signal / wifi / battery cluster; tone flips for light UI vs the dark onboarding art.
function StatusIcons({ tone }: { tone: 'light' | 'dark' }) {
  const c = tone === 'light' ? 'text-navy/80' : 'text-white';
  return (
    <div className={cn('flex items-center gap-1.5', c)}>
      <svg viewBox="0 0 20 12" className="h-2.5 w-4" fill="currentColor" aria-hidden>
        <rect x="0" y="7" width="3" height="5" rx="1" />
        <rect x="5" y="4.5" width="3" height="7.5" rx="1" />
        <rect x="10" y="2" width="3" height="10" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" />
      </svg>
      <svg viewBox="0 0 20 14" className="h-2.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M10 13.5 0.5 4a13 13 0 0 1 19 0L10 13.5Z" />
      </svg>
      <svg viewBox="0 0 26 13" className="h-2.5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
        <rect x="0.6" y="0.6" width="21" height="11.8" rx="2.6" />
        <rect x="2.6" y="2.6" width="14" height="7.8" rx="1.2" fill="currentColor" stroke="none" />
        <rect x="23" y="4" width="2.4" height="5" rx="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

/* ── Native chrome ─────────────────────────────────────────────────────── */

// The status bar. iOS puts the clock on the LEFT with a centred Dynamic Island; Android keeps the
// clock on the RIGHT beside the status icons and shows notification dots on the left.
function StatusBar({ platform, dark }: { platform: Platform; dark: boolean }) {
  const tone = dark ? 'dark' : 'light';
  const clock = dark ? 'text-white' : 'text-navy';
  if (platform === 'ios') {
    return (
      <div className="relative flex h-9 shrink-0 items-center justify-between px-5 pt-1">
        <span className={cn('text-[11px] font-semibold tabular-nums', clock)}>9:41</span>
        {/* Dynamic Island */}
        <span aria-hidden className="absolute left-1/2 top-1.5 h-5 w-16 -translate-x-1/2 rounded-full bg-black" />
        <StatusIcons tone={tone} />
      </div>
    );
  }
  return (
    <div className="flex h-8 shrink-0 items-center justify-between px-4 pt-1">
      <span className={cn('flex items-center gap-1.5', dark ? 'text-white' : 'text-navy/70')}>
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      </span>
      <span className="flex items-center gap-2">
        <StatusIcons tone={tone} />
        <span className={cn('text-[11px] font-medium tabular-nums', clock)}>9:41</span>
      </span>
    </div>
  );
}

// The app header. iOS centres the title with a thin back chevron; Android left-aligns the title
// with a back arrow and an overflow menu, and carries a hair of Material elevation. The phone is a
// scroll-driven mockup, so the back affordance is a decorative indicator, not a control.
function AppHeader({ platform, title, showBack }: { platform: Platform; title: string; showBack: boolean }) {
  if (platform === 'ios') {
    return (
      <div className="relative flex h-11 shrink-0 items-center justify-center border-b border-black/[0.06] px-3">
        {showBack && (
          <span aria-hidden className="absolute left-2 flex items-center text-orange">
            <Glyph kind="chevron-left" className="h-5 w-5" />
          </span>
        )}
        <span className="font-sans text-[15px] font-semibold text-navy">{title}</span>
      </div>
    );
  }
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-black/[0.04] px-3 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.35)]">
      {showBack && (
        <span aria-hidden className="flex items-center text-navy/80">
          <svg {...svg} className="h-5 w-5">
            <path d="M20 12H4M10 6l-6 6 6 6" />
          </svg>
        </span>
      )}
      <span className="flex-1 font-sans text-[17px] font-semibold text-navy">{title}</span>
      <Glyph kind="dots" className="h-4 w-4 text-navy/55" />
    </div>
  );
}

// Bottom tab bar — hidden on onboarding. Both platforms share four tabs; iOS stacks a tiny label
// under each icon, Android floats an active "pill" behind the current tab (Material 3).
const TABS = [
  { kind: 'home', label: 'Home' },
  { kind: 'search', label: 'Search' },
  { kind: 'bag', label: 'Orders' },
  { kind: 'user', label: 'Profile' },
];

function TabBar({ platform, active }: { platform: Platform; active: number }) {
  if (platform === 'ios') {
    return (
      <div className="flex shrink-0 items-start justify-around border-t border-black/[0.06] px-2 pt-2 pb-1">
        {TABS.map((t, i) => (
          <div key={t.kind} className="flex flex-col items-center gap-0.5">
            <Glyph kind={t.kind} className={cn('h-5 w-5', i === active ? 'text-orange' : 'text-navy/40')} />
            <span className={cn('text-[9px]', i === active ? 'font-semibold text-orange' : 'text-navy/40')}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center justify-around border-t border-black/[0.05] px-2 py-2">
      {TABS.map((t, i) => (
        <div
          key={t.kind}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors',
            i === active ? 'bg-orange/15' : '',
          )}
        >
          <Glyph kind={t.kind} className={cn('h-5 w-5', i === active ? 'text-orange' : 'text-navy/45')} />
          {i === active && <span className="text-[11px] font-semibold text-orange">{t.label}</span>}
        </div>
      ))}
    </div>
  );
}

// The system nav at the very bottom of the device — iOS shows a single home indicator, Android
// shows the three-button navigation (back triangle, home circle, recents square).
function SystemNav({ platform }: { platform: Platform }) {
  if (platform === 'ios') {
    return (
      <div className="flex h-5 shrink-0 items-center justify-center">
        <span aria-hidden className="h-1 w-28 rounded-full bg-navy/30" />
      </div>
    );
  }
  return (
    <div className="flex h-8 shrink-0 items-center justify-center gap-14 bg-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className="h-3.5 w-3.5 text-navy/55">
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span aria-hidden className="h-3.5 w-3.5 rounded-full border-[1.6px] border-navy/55" />
      <span aria-hidden className="h-3 w-3 rounded-[3px] border-[1.6px] border-navy/55" />
    </div>
  );
}

/* ── Screen bodies ─────────────────────────────────────────────────────── */

function RatingStars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('flex items-center gap-0.5', className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('h-3 w-3', i < value ? 'text-orange' : 'text-navy/15')} />
      ))}
    </span>
  );
}

// Discover stage — the first-launch screen as a low-fidelity wireframe: hatched image placeholder,
// grey skeleton copy, and a dashed action. It's the same layout the designed onboarding fills in.
function WireframeScreen({ platform }: { platform: Platform }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#eceef1]">
      {/* Image placeholder — diagonal hatch + centred image glyph. */}
      <div
        className="absolute inset-x-0 top-0 h-[58%] border-b border-navy/10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(15,21,31,0.06) 0 1px, transparent 1px 9px)',
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-navy/25">
          <Glyph kind="image" className="h-9 w-9" />
        </span>
      </div>
      {/* Skeleton copy + dashed CTA. */}
      <div className="relative flex h-full flex-col justify-end gap-2.5 p-6">
        <span className="h-6 w-1/2 rounded-md bg-navy/20" />
        <span className="h-2.5 w-4/5 rounded-full bg-navy/12" />
        <span className="h-2.5 w-3/5 rounded-full bg-navy/12" />
        <span
          className={cn(
            'mt-2 flex h-11 items-center justify-center border-2 border-dashed border-navy/25 text-[12px] font-medium text-navy/35',
            platform === 'ios' ? 'rounded-xl' : 'rounded-full',
          )}
        >
          Primary action
        </span>
      </div>
    </div>
  );
}

function OnboardingScreen({ platform }: { platform: Platform }) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FEATURE.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <span className="font-sans text-3xl font-bold tracking-tight text-white">Sufra</span>
        <p className="mt-2 max-w-[80%] text-[13px] leading-relaxed text-white/75">
          Great food from the places you love, delivered to your door.
        </p>
        <span
          className={cn(
            'mt-5 flex h-11 items-center justify-center bg-orange text-[15px] font-semibold text-navy',
            platform === 'ios' ? 'rounded-xl' : 'rounded-full',
          )}
        >
          Get started
        </span>
        <span className="mt-3 text-center text-[12px] text-white/60">Already have an account? Sign in</span>
      </div>
    </div>
  );
}

function HomeScreen({ platform }: { platform: Platform }) {
  return (
    <div className="relative min-h-full flex-1 bg-[#f7f8fa]">
      <div className="flex min-h-full flex-col">
        <div className="shrink-0 px-4 pt-3">
          {/* Search field */}
          <div className="flex items-center gap-2 rounded-xl bg-black/[0.04] px-3 py-2.5">
            <Glyph kind="search" className="h-4 w-4 text-navy/40" />
            <span className="text-[12px] text-navy/40">Search dishes, places…</span>
          </div>
          {/* Category chips */}
          <div className="mt-3 flex gap-2 overflow-hidden">
            {CATEGORIES.map((c, i) => (
              <span
                key={c}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium',
                  i === 0 ? 'bg-orange text-navy' : 'bg-black/[0.05] text-navy/60',
                )}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 space-y-2.5 px-4 pb-6">
          {DISHES.map((d) => (
            <div
              key={d.name}
              className="flex w-full items-center gap-3 rounded-xl bg-white p-2 text-left ring-1 ring-black/[0.04]"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-navy">{d.name}</span>
                <span className="mt-0.5 block text-[11px] text-navy/45">
                  {d.place} · {d.time}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-navy">
                <Star className="h-3 w-3 text-orange" />
                {d.rating}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Android floating action button — a Material signature iOS has no equivalent for. */}
      {platform === 'android' && (
        <span
          aria-hidden
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange text-navy shadow-[0_8px_20px_-6px_rgba(245,139,39,0.7)]"
        >
          <Glyph kind="plus" className="h-6 w-6" />
        </span>
      )}
    </div>
  );
}

function DetailScreen({ platform }: { platform: Platform }) {
  return (
    <div className="relative min-h-full flex-1 bg-white">
      <div className="flex min-h-full flex-col">
        <div className="relative h-40 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FEATURE.img} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="px-4 pt-3.5 pb-4">
          <h4 className="font-sans text-[17px] font-bold text-navy">{FEATURE.name}</h4>
          <div className="mt-1.5 flex items-center gap-2">
            <RatingStars value={5} />
            <span className="text-[12px] font-semibold text-navy">{FEATURE.rating}</span>
            <span className="text-[11px] text-navy/40">· 1,240 ratings</span>
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-navy/55">
            Aged beef, black truffle mayo, and smoked cheddar in a toasted brioche bun. From {FEATURE.place}.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-navy/45">
            Served with hand-cut fries and house pickles. Customise spice level and add-ons before checkout.
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-sans text-[22px] font-bold text-navy">AED 48</span>
            <span className="text-[11px] text-navy/40">· {FEATURE.time} delivery</span>
          </div>
          <div className="mt-4 space-y-2 border-t border-black/[0.06] pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/40">Add-ons</p>
            <p className="text-[12px] text-navy/55">Truffle fries · AED 12</p>
            <p className="text-[12px] text-navy/55">Extra patty · AED 18</p>
          </div>
        </div>
        <div className="mt-auto shrink-0 border-t border-black/[0.05] p-3.5">
          <span
            className={cn(
              'flex h-11 w-full items-center justify-center bg-orange text-[15px] font-semibold text-navy',
              platform === 'ios' ? 'rounded-xl' : 'rounded-full',
            )}
          >
            Add to cart · AED 48
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderScreen({ platform }: { platform: Platform }) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#f7f8fa] px-6 text-center">
      <span
        className={cn(
          'flex h-16 w-16 items-center justify-center bg-orange text-navy',
          platform === 'ios' ? 'rounded-full' : 'rounded-2xl',
        )}
      >
        <Glyph kind="check" className="h-8 w-8" />
      </span>
      <h4 className="mt-5 font-sans text-[19px] font-bold text-navy">Order placed</h4>
      <p className="mt-2 text-[12px] leading-relaxed text-navy/55">
        Your {FEATURE.name.toLowerCase()} from {FEATURE.place} is being prepared.
      </p>
      <div className="mt-5 w-full max-w-[80%] border-t border-black/[0.08] pt-4">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-navy/45">Estimated arrival</span>
          <span className="font-semibold text-navy">{FEATURE.time}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px]">
          <span className="text-navy/45">Total paid</span>
          <span className="font-semibold text-navy">AED 48</span>
        </div>
      </div>
    </div>
  );
}

/* ── The phone ─────────────────────────────────────────────────────────── */

const HEADER_TITLE: Record<ScreenId, string> = {
  onboarding: '',
  home: 'Discover',
  detail: 'Details',
  order: 'Confirmed',
};

// The device mock. `screen` + `wire` are driven by the scroll stage; the body re-keys per
// screen/platform so each state animates up cleanly as the mockup advances.
function Phone({
  platform,
  screen,
  wire,
  reduced,
  scrollRef,
}: {
  platform: Platform;
  screen: ScreenId;
  wire: boolean;
  reduced: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const isOnboarding = screen === 'onboarding';
  const dark = isOnboarding && !wire;
  const activeTab = screen === 'detail' ? 0 : screen === 'order' ? 2 : 0;
  const isIos = platform === 'ios';

  return (
    <div
      className={cn(
        'relative mx-auto w-[196px] shrink-0 bg-navy p-2 shadow-[0_32px_70px_-36px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:w-[214px] lg:w-[228px]',
        isIos ? 'rounded-[2.75rem]' : 'rounded-[1.9rem]',
      )}
    >
      {/* Side button hint */}
      <span aria-hidden className="absolute -right-[3px] top-24 h-12 w-[3px] rounded-r bg-navy" />
      <div
        className={cn(
          'relative flex h-[380px] flex-col overflow-hidden bg-white sm:h-[410px] lg:h-[430px]',
          isIos ? 'rounded-[2.1rem]' : 'rounded-[1.3rem]',
        )}
      >
        <StatusBar platform={platform} dark={dark} />
        {!isOnboarding && (
          <AppHeader platform={platform} title={HEADER_TITLE[screen]} showBack={screen === 'detail'} />
        )}

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="flex min-h-full flex-col will-change-transform">
            <div
              key={`${platform}-${screen}-${wire ? 'w' : 'd'}`}
              className={cn(
                'flex min-h-full flex-col',
                !reduced && 'animate-[tier-rise_360ms_ease-out_both]',
              )}
            >
              {wire ? (
                <WireframeScreen platform={platform} />
              ) : isOnboarding ? (
                <OnboardingScreen platform={platform} />
              ) : screen === 'home' ? (
                <HomeScreen platform={platform} />
              ) : screen === 'detail' ? (
                <DetailScreen platform={platform} />
              ) : (
                <OrderScreen platform={platform} />
              )}
            </div>
          </div>
        </div>

        {!isOnboarding && <TabBar platform={platform} active={activeTab} />}
        <SystemNav platform={platform} />
      </div>
    </div>
  );
}

/* ── Shared bits ───────────────────────────────────────────────────────── */

function PlatformToggle({
  platform,
  onChange,
  className,
}: {
  platform: Platform;
  onChange: (p: Platform) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Platform"
      className={cn('inline-flex w-fit max-w-full gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1', className)}
    >
      {PLATFORMS.map((p) => {
        const on = platform === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            aria-pressed={on}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ease-out sm:px-6',
              on ? 'bg-orange text-navy shadow-sm' : 'text-white/55 hover-fine:hover:text-white',
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionHead() {
  return (
    <>
      <SectionLabel className="mb-3">The build</SectionLabel>
      <h2
        className="mb-8 max-w-4xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white lg:mb-10"
        style={{ fontSize: 'clamp(1.4rem, 3vw, 2.35rem)' }}
      >
        From wireframe to launch.
      </h2>
    </>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

export function MobileAppShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const reduced = useReducedMotion();
  const [platform, setPlatform] = useState<Platform>('ios');
  const [active, setActive] = useState(0);
  const n = STAGES.length;

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (n - 1) * 0.85)}`,
        pin,
        scrub: true,
        onUpdate: (self) => {
          const raw = self.progress * n;
          const idx = Math.min(n - 1, Math.max(0, Math.floor(raw)));
          const frac = Math.min(1, raw - idx);
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
          const y = scrollAmountForStage(STAGES[idx], frac);
          gsap.set(phoneScrollRef.current, { y: -y });
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduced, n]);

  // Reduced-motion / no-scrub fallback: a static, fully readable version — every stage listed, the
  // phone resting on one finished screen, platform toggle still live.
  if (reduced) {
    return (
      <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto w-full max-w-[88rem]">
          <SectionHead />
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="mx-auto flex w-full flex-col items-center gap-4">
              <PlatformToggle platform={platform} onChange={setPlatform} />
              <Phone platform={platform} screen="home" wire={false} reduced />
            </div>
            <ol className="w-full min-w-0 lg:pt-2">
              {STAGES.map((s, i) => (
                <li key={s.name} className="flex gap-4 border-b border-white/10 py-5 last:border-b-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 text-[12px] font-bold tabular-nums text-orange">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="block font-sans text-base font-bold tracking-tight text-white">{s.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/55">{s.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  const cur = STAGES[active];

  return (
    <section ref={wrapRef} className="relative">
      <div
        ref={pinRef}
        className="relative flex max-h-[100svh] min-h-[100svh] flex-col justify-center overflow-hidden px-gutter-m py-10 lg:px-gutter-d lg:py-12"
      >
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto w-full max-w-[88rem]">
          <SectionHead />

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="mx-auto flex w-full flex-col items-center gap-4">
              <PlatformToggle platform={platform} onChange={setPlatform} />
              <Phone
                platform={platform}
                screen={cur.screen}
                wire={!!cur.wire}
                reduced={false}
                scrollRef={phoneScrollRef}
              />
            </div>

            <div className="w-full min-w-0 lg:flex lg:flex-col lg:justify-center lg:pl-2 xl:pl-4">
              {/* Desktop — a vertical build timeline; the active stage enlarges, its detail crossfades. */}
              <ol className="hidden lg:block">
                {STAGES.map((s, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <li key={s.name} className="flex gap-5">
                      {/* Rail column — node + connector to the next stage (fills orange as you pass). */}
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold tabular-nums transition-all duration-300',
                            on
                              ? 'scale-110 border-orange bg-orange text-navy'
                              : done
                                ? 'border-orange/60 text-orange'
                                : 'border-white/25 text-white/40',
                          )}
                        >
                          {done ? <Glyph kind="check" className="h-4 w-4" /> : i + 1}
                        </span>
                        {i < n - 1 && (
                          <span
                            aria-hidden
                            className={cn(
                              'w-px flex-1 transition-colors duration-300',
                              i < active ? 'bg-orange/60' : 'bg-white/12',
                            )}
                          />
                        )}
                      </div>
                      {/* Content — collapsed name when idle; enlarges + reveals detail when active. */}
                      <div className="min-w-0 flex-1 pb-5">
                        <div className="flex min-h-[2rem] items-end">
                          <span
                            className={cn(
                              'block font-sans font-bold tracking-tight transition-colors duration-300',
                              on ? 'text-white' : done ? 'text-white/22' : 'text-white/14',
                            )}
                            style={{ fontSize: on ? 'clamp(1.35rem, 2.5vw, 2.15rem)' : '1rem' }}
                          >
                            {s.name}
                          </span>
                        </div>
                        <div className="mt-1.5 min-h-[2.85rem]">
                          <p
                            className={cn(
                              'line-clamp-2 text-sm leading-relaxed transition-colors duration-300 xl:text-base',
                              on ? 'text-white/90' : 'text-white/12',
                            )}
                          >
                            {s.detail}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Mobile — compact: the active stage name + detail, then a segmented progress track. */}
              <div className="lg:hidden">
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    key={`n-${active}`}
                    className="animate-[tier-rise_360ms_ease-out_both] font-sans text-xl font-bold tracking-tight text-white"
                  >
                    {cur.name}
                  </span>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-white/40">
                    Step {active + 1} / {n}
                  </span>
                </div>
                <p
                  key={`d-${active}`}
                  className="mt-2 min-h-[3.25rem] animate-[tier-rise_360ms_ease-out_both] text-sm leading-relaxed text-white/60"
                >
                  {cur.detail}
                </p>
                <div className="mt-4 flex gap-1.5">
                  {STAGES.map((s, i) => (
                    <span
                      key={s.name}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-colors duration-300',
                        i <= active ? 'bg-orange' : 'bg-white/15',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
