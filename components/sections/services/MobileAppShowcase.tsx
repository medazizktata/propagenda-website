'use client';

import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// The signature module for Mobile Applications. Websites already owns the "device that resizes"
// idea (a browser window with a Desktop/Tablet/Mobile toggle + Lighthouse gauge), so this makes a
// deliberately different point: the APP EXPERIENCE itself. One phone holds a real, tappable app
// flow — onboarding → home → detail → confirmation — and an iOS ⇄ Android toggle swaps the native
// chrome (status-bar clock side, header alignment, tab bar, home indicator vs system nav, the
// Android FAB) so the same screens prove they feel at home on both platforms. Nothing here
// resizes; the interaction is the flow and the platform, not the breakpoint. App content and
// imagery are illustrative placeholders drawn from the portfolio pool.

type Platform = 'ios' | 'android';
type ScreenId = 'onboarding' | 'home' | 'detail' | 'order';

const SCREENS: { id: ScreenId; name: string; caption: string }[] = [
  { id: 'onboarding', name: 'Onboarding', caption: 'A warm first launch — brand, promise, and one clear call to action.' },
  { id: 'home', name: 'Home', caption: 'Browse, search, and filter — the everyday screen, built for thumbs.' },
  { id: 'detail', name: 'Detail', caption: 'Rich detail with real ratings and a confident primary action.' },
  { id: 'order', name: 'Confirmation', caption: 'Instant, unmistakable feedback the moment an order lands.' },
];

const CATEGORIES = ['Popular', 'Grills', 'Healthy', 'Dessert'];
const DISHES = [
  { img: '/images/portfolio/work-food.png', name: 'Truffle burger', place: 'Grill House', time: '25 min', rating: '4.9' },
  { img: '/images/portfolio/work-restaurant.png', name: 'Sunday roast', place: 'The Table', time: '35 min', rating: '4.8' },
  { img: '/images/portfolio/work-ghaftree.png', name: 'Garden bowl', place: 'Ghaf Tree', time: '20 min', rating: '4.7' },
];
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
// with a back arrow and an overflow menu, and carries a hair of Material elevation.
function AppHeader({
  platform,
  title,
  showBack,
  onBack,
}: {
  platform: Platform;
  title: string;
  showBack: boolean;
  onBack: () => void;
}) {
  if (platform === 'ios') {
    return (
      <div className="relative flex h-11 shrink-0 items-center justify-center border-b border-black/[0.06] px-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-2 flex items-center text-orange"
          >
            <Glyph kind="chevron-left" className="h-5 w-5" />
          </button>
        )}
        <span className="font-sans text-[15px] font-semibold text-navy">{title}</span>
      </div>
    );
  }
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-black/[0.04] px-3 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.35)]">
      {showBack && (
        <button type="button" onClick={onBack} aria-label="Back" className="flex items-center text-navy/80">
          <svg {...svg} className="h-5 w-5">
            <path d="M20 12H4M10 6l-6 6 6 6" />
          </svg>
        </button>
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

function OnboardingScreen({ platform, onNext }: { platform: Platform; onNext: () => void }) {
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
        <button
          type="button"
          onClick={onNext}
          className={cn(
            'mt-5 flex h-11 items-center justify-center bg-orange text-[15px] font-semibold text-navy',
            platform === 'ios' ? 'rounded-xl' : 'rounded-full',
          )}
        >
          Get started
        </button>
        <span className="mt-3 text-center text-[12px] text-white/60">Already have an account? Sign in</span>
      </div>
    </div>
  );
}

function HomeScreen({ platform, onOpen }: { platform: Platform; onOpen: () => void }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#f7f8fa]">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="px-4 pt-3">
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
        {/* Dish list */}
        <div className="mt-3 flex-1 space-y-2.5 overflow-hidden px-4 pb-4">
          {DISHES.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={onOpen}
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
            </button>
          ))}
        </div>
      </div>
      {/* Android floating action button — a Material signature iOS has no equivalent for. */}
      {platform === 'android' && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="New order"
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange text-navy shadow-[0_8px_20px_-6px_rgba(245,139,39,0.7)]"
        >
          <Glyph kind="plus" className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

function DetailScreen({ platform, onOrder }: { platform: Platform; onOrder: () => void }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-white">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="relative h-40 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FEATURE.img} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 overflow-hidden px-4 pt-3.5">
          <h4 className="font-sans text-[17px] font-bold text-navy">{FEATURE.name}</h4>
          <div className="mt-1.5 flex items-center gap-2">
            <RatingStars value={5} />
            <span className="text-[12px] font-semibold text-navy">{FEATURE.rating}</span>
            <span className="text-[11px] text-navy/40">· 1,240 ratings</span>
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-navy/55">
            Aged beef, black truffle mayo, and smoked cheddar in a toasted brioche bun. From {FEATURE.place}.
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-sans text-[22px] font-bold text-navy">AED 48</span>
            <span className="text-[11px] text-navy/40">· {FEATURE.time} delivery</span>
          </div>
        </div>
        {/* Sticky primary action */}
        <div className="shrink-0 border-t border-black/[0.05] p-3.5">
          <button
            type="button"
            onClick={onOrder}
            className={cn(
              'flex h-11 w-full items-center justify-center bg-orange text-[15px] font-semibold text-navy',
              platform === 'ios' ? 'rounded-xl' : 'rounded-full',
            )}
          >
            Add to cart · AED 48
          </button>
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

function Phone({
  platform,
  screen,
  reduced,
  go,
}: {
  platform: Platform;
  screen: ScreenId;
  reduced: boolean;
  go: (id: ScreenId) => void;
}) {
  const dark = screen === 'onboarding';
  const activeTab = screen === 'detail' ? 0 : screen === 'order' ? 2 : 0;
  const isIos = platform === 'ios';

  return (
    <div
      className={cn(
        'relative mx-auto w-[264px] shrink-0 bg-navy p-2.5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:w-[280px]',
        isIos ? 'rounded-[2.75rem]' : 'rounded-[1.9rem]',
      )}
    >
      {/* Side button hint */}
      <span aria-hidden className="absolute -right-[3px] top-24 h-12 w-[3px] rounded-r bg-navy" />
      <div
        className={cn(
          'relative flex h-[540px] flex-col overflow-hidden bg-white sm:h-[560px]',
          isIos ? 'rounded-[2.1rem]' : 'rounded-[1.3rem]',
        )}
      >
        <StatusBar platform={platform} dark={dark} />
        {screen !== 'onboarding' && (
          <AppHeader
            platform={platform}
            title={HEADER_TITLE[screen]}
            showBack={screen === 'detail'}
            onBack={() => go('home')}
          />
        )}

        {/* Screen body — re-keyed per screen+platform so each state animates up cleanly. */}
        <div
          key={`${platform}-${screen}`}
          className={cn('flex flex-1 flex-col overflow-hidden', !reduced && 'animate-[tier-rise_360ms_ease-out_both]')}
        >
          {screen === 'onboarding' && <OnboardingScreen platform={platform} onNext={() => go('home')} />}
          {screen === 'home' && <HomeScreen platform={platform} onOpen={() => go('detail')} />}
          {screen === 'detail' && <DetailScreen platform={platform} onOrder={() => go('order')} />}
          {screen === 'order' && <OrderScreen platform={platform} />}
        </div>

        {screen !== 'onboarding' && <TabBar platform={platform} active={activeTab} />}
        <SystemNav platform={platform} />
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

export function MobileAppShowcase() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [stepIndex, setStepIndex] = useState(0);
  const reduced = useReducedMotion();
  const screen = SCREENS[stepIndex].id;

  const go = (id: ScreenId) => setStepIndex(SCREENS.findIndex((s) => s.id === id));
  const atEnd = stepIndex === SCREENS.length - 1;

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">The app</SectionLabel>
        <h2
          className="sd-reveal mb-4 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          Step through the experience.
        </h2>
        <p className="sd-reveal mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-white/60 md:text-base">
          Tap through a real app flow — from first launch to a placed order — then switch platforms
          and watch the native chrome adapt. Same screens, genuinely at home on iOS and Android.
        </p>

        {/* Platform toggle — swaps the native chrome on the phone below. */}
        <div className="sd-reveal mb-8 flex items-center justify-center">
          <div className="inline-flex gap-1 rounded-xl border border-white/12 bg-white/[0.03] p-1">
            {PLATFORMS.map((p) => {
              const on = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  aria-pressed={on}
                  className={cn(
                    'rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-300 ease-out',
                    on ? 'bg-orange text-navy' : 'text-white/55 hover-fine:hover:text-white',
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sd-reveal grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* The phone — the one bold focal element. */}
          <Phone platform={platform} screen={screen} reduced={reduced} go={go} />

          {/* Flow stepper — pick a screen, or walk it with Back / Next. */}
          <div className="w-full">
            <ol className="flex flex-col">
              {SCREENS.map((s, i) => {
                const on = stepIndex === i;
                const done = i < stepIndex;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setStepIndex(i)}
                      aria-current={on}
                      className="group/st flex w-full items-start gap-4 border-b border-white/10 py-4 text-left"
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums transition-all duration-300',
                          on
                            ? 'border-orange bg-orange text-navy'
                            : done
                              ? 'border-orange/60 text-orange'
                              : 'border-white/25 text-white/40',
                        )}
                      >
                        {done ? <Glyph kind="check" className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            'block font-sans text-lg font-bold tracking-tight transition-colors duration-300',
                            on ? 'text-orange' : 'text-white group-hover/st:text-white',
                          )}
                        >
                          {s.name}
                        </span>
                        <span
                          className={cn(
                            'mt-0.5 block text-sm leading-relaxed transition-all duration-300',
                            on ? 'text-white/60' : 'text-white/30',
                          )}
                        >
                          {s.caption}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Walk controls */}
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="text-sm font-semibold text-white/55 transition-colors hover-fine:hover:text-white disabled:opacity-30 disabled:hover-fine:hover:text-white/55"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStepIndex((i) => (atEnd ? 0 : i + 1))}
                className="flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-navy transition-transform duration-300 hover-fine:hover:-translate-y-0.5"
              >
                {atEnd ? 'Start over' : 'Next screen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
