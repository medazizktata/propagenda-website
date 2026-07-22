'use client';

import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';

// The signature module for Online & Offline Marketing — an interactive full-funnel. The four
// stages (Awareness → Consideration → Conversion → Loyalty) sit in a tapering vertical funnel on
// the left; selecting or hovering one crossfades the right panel to that stage, where the channels
// and tactics are split into Online and Offline columns. The one bold focal element per state is
// the giant stage index. Reach/return figures are TEMPORARY, illustrative placeholders until real
// campaign data lands.
type Stage = {
  name: string;
  goal: string;
  stat: string;
  statLabel: string;
  online: string[];
  offline: string[];
};

const STAGES: Stage[] = [
  {
    name: 'Awareness',
    goal: 'Get discovered by the right audience.',
    stat: '3.2M',
    statLabel: 'Avg. impressions per campaign',
    online: ['Social ads', 'Influencer seeding', 'SEO content', 'Display & video'],
    offline: ['OOH & billboards', 'Print & press', 'Events & activations'],
  },
  {
    name: 'Consideration',
    goal: 'Earn interest and build trust.',
    stat: '48%',
    statLabel: 'Returning-visitor rate',
    online: ['Retargeting', 'Email nurture', 'Comparison content', 'Webinars'],
    offline: ['Brochures & catalogues', 'Showroom demos', 'Direct mail'],
  },
  {
    name: 'Conversion',
    goal: 'Turn interest into action.',
    stat: '5.4×',
    statLabel: 'Return on ad spend',
    online: ['Paid search', 'Landing pages', 'Promo offers', 'Cart recovery'],
    offline: ['In-store promotions', 'Point-of-sale', 'Sales collateral'],
  },
  {
    name: 'Loyalty',
    goal: 'Keep customers coming back.',
    stat: '62%',
    statLabel: 'Repeat-purchase rate',
    online: ['Email & SMS', 'Loyalty app', 'Community & UGC'],
    offline: ['Loyalty cards', 'VIP events', 'Thank-you mailers'],
  },
];

const num = (i: number) => String(i + 1).padStart(2, '0');

// Tapering widths make the stage rail read as a funnel — widest at Awareness, narrowing toward
// Conversion, with Loyalty as the retained core at the base.
const STAGE_WIDTH = ['100%', '90%', '80%', '70%'];

// Small header glyphs so the two channel columns read at a glance: a globe for the connected,
// digital channels; a location pin for the physical, in-the-world channels.
function ChannelIcon({ kind, className }: { kind: 'online' | 'offline'; className?: string }) {
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
  if (kind === 'online') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function ChannelColumn({
  kind,
  label,
  items,
}: {
  kind: 'online' | 'offline';
  label: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5 border-b border-white/10 pb-3">
        <ChannelIcon kind={kind} className="h-4 w-4 text-orange" />
        <span className="font-sans text-sm font-semibold text-white">{label}</span>
      </div>
      <ul className="flex flex-col">
        {items.map((c) => (
          <li key={c} className="flex items-center gap-2.5 py-2">
            <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-orange/70" />
            <span className="text-[0.95rem] text-white/75">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFunnel() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">The full funnel</SectionLabel>
        <h2
          className="sd-reveal mb-10 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          One journey, online and offline.
        </h2>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:gap-14">
          {/* ── Funnel rail: tapering stages, widest at the top ── */}
          <div className="sd-reveal flex flex-col items-center gap-2.5">
            {STAGES.map((s, i) => {
              const on = active === i;
              return (
                <button
                  key={s.name}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  style={{ width: STAGE_WIDTH[i] }}
                  className={cn(
                    'group/st flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-300 ease-out',
                    on
                      ? 'border-orange bg-orange/[0.08]'
                      : 'border-white/12 bg-white/[0.02] hover-fine:hover:border-white/30 hover-fine:hover:bg-white/[0.04]',
                  )}
                >
                  <span
                    className={cn(
                      'font-sans text-sm font-bold tabular-nums transition-colors duration-300',
                      on ? 'text-orange' : 'text-white/30',
                    )}
                  >
                    {num(i)}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block font-sans font-bold tracking-tight transition-colors duration-300',
                        on ? 'text-white' : 'text-white/60',
                      )}
                      style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.35rem)' }}
                    >
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block truncate text-sm transition-colors duration-300',
                        on ? 'text-white/60' : 'text-white/35',
                      )}
                    >
                      {s.goal}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Detail panel: giant stage index + the online / offline channel split ── */}
          <div className="sd-reveal">
            <div key={active} className="motion-safe:animate-[tier-rise_450ms_ease-out_both]">
              {/* The one bold focal element — the stage index at display scale. */}
              <div className="flex items-center gap-5">
                <span
                  className="font-sans font-black leading-[0.8] tabular-nums text-orange"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)' }}
                >
                  {num(active)}
                </span>
                <div>
                  <span className="text-sm text-white/40">
                    Stage {active + 1} of {STAGES.length}
                  </span>
                  <h3 className="font-sans text-2xl font-bold text-white lg:text-3xl">{stage.name}</h3>
                  <p className="mt-1 max-w-md text-[0.95rem] leading-relaxed text-white/60">{stage.goal}</p>
                </div>
              </div>

              {/* Headline figure for the stage. */}
              <div className="mt-6 flex items-baseline gap-3 border-t border-white/10 pt-5">
                <span className="font-sans text-2xl font-bold text-white md:text-3xl">{stage.stat}</span>
                <span className="text-sm text-white/45">{stage.statLabel}</span>
              </div>

              {/* Channels & tactics — split online vs offline. */}
              <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <ChannelColumn kind="online" label="Online" items={stage.online} />
                <ChannelColumn kind="offline" label="Offline" items={stage.offline} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
