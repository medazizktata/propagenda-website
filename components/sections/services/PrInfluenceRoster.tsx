'use client';

import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';

// The signature PR module — an interactive "influence roster". A left ledger lists the partner
// types PR connects brands with (a real roster, so each row carries a face/thumbnail); selecting
// or hovering one crossfades the right spotlight to that partner, with an illustrative frame,
// a single bold reach figure as the focal point, a short description, and two supporting metrics.
// The two columns are matched to equal height: the ledger stretches to the spotlight's height and
// its rows distribute to fill, so the last hairline aligns with the panel's bottom edge at every
// breakpoint. Reach/engagement figures are TEMPORARY placeholders until real campaign data lands.
// Imagery is borrowed from the portfolio pool as stand-ins.
type Partner = {
  name: string;
  blurb: string;
  reach: string;
  reachLabel: string;
  example: string;
  metrics: { value: string; label: string }[];
  image: string;
};

const PARTNERS: Partner[] = [
  {
    name: 'A-list celebrities',
    blurb:
      'Household names whose endorsement lends instant authority — regional film, music, and sports stars your audience already follows.',
    reach: '25M+',
    reachLabel: 'Combined following',
    example: 'Launch events, red-carpet appearances, and signature endorsements.',
    metrics: [
      { value: '4.8%', label: 'Avg. engagement' },
      { value: '40+', label: 'Campaigns run' },
    ],
    image: '/images/portfolio/work-events.png',
  },
  {
    name: 'Bloggers & creators',
    blurb:
      'Trusted niche voices with loyal communities — lifestyle, food, travel, and beauty creators who turn a mention into momentum.',
    reach: '12M+',
    reachLabel: 'Combined reach',
    example: 'Sponsored reviews, unboxings, and day-in-the-life features.',
    metrics: [
      { value: '6.2%', label: 'Avg. engagement' },
      { value: '150+', label: 'Creators on roster' },
    ],
    image: '/images/portfolio/work-food.png',
  },
  {
    name: 'Gamers & streamers',
    blurb:
      'Live audiences that show up every session — Twitch and YouTube streamers whose watch-time converts attention into action.',
    reach: '8M+',
    reachLabel: 'Monthly viewers',
    example: 'Sponsored streams, in-game integrations, and tournament tie-ins.',
    metrics: [
      { value: '35 min', label: 'Avg. watch time' },
      { value: '20+', label: 'Streamers' },
    ],
    image: '/images/portfolio/work-quickcars.png',
  },
  {
    name: 'Actors & artists',
    blurb:
      'Cultural credibility from stage and screen — actors, musicians, and visual artists who align your brand with real craft.',
    reach: '10M+',
    reachLabel: 'Combined audience',
    example: 'Brand ambassadorships, creative collaborations, and feature spots.',
    metrics: [
      { value: '5.1%', label: 'Avg. engagement' },
      { value: '30+', label: 'Collaborations' },
    ],
    image: '/images/portfolio/work-restaurant.png',
  },
  {
    name: 'Press & media',
    blurb:
      "Earned coverage money can't buy — placements across the region's leading publications, broadcast, and digital press.",
    reach: '50+',
    reachLabel: 'Media outlets',
    example: 'Press releases, features, interviews, and launch coverage.',
    metrics: [
      { value: '200+', label: 'Placements secured' },
      { value: '3×', label: 'Avg. reach lift' },
    ],
    image: '/images/portfolio/work-ghaftree.png',
  },
];

export function PrInfluenceRoster() {
  const [active, setActive] = useState(0);
  const p = PARTNERS[active];

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">Who we connect you with</SectionLabel>
        <h2
          className="sd-reveal mb-4 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          An influence roster with real reach.
        </h2>
        {/* Deck — sets up the interaction and folds in the network-at-scale figure. */}
        <p className="sd-reveal mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-white/60 md:text-base">
          From household names to niche creators and earned press — a curated roster reaching more
          than 50 million people across the region. Select a partner to see the reach behind it.
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_1.08fr] lg:items-stretch lg:gap-12">
          {/* ── Roster ledger: partner types, each with a face and its headline reach. Rows grow
               to fill so the ledger matches the spotlight's height and the last hairline lands on
               the panel's bottom edge. ── */}
          <ul className="sd-reveal flex h-full flex-col border-t border-white/10">
            {PARTNERS.map((partner, i) => {
              const on = active === i;
              return (
                <li key={partner.name} className="flex flex-1">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group/row relative flex h-full w-full items-center gap-4 border-b border-white/10 py-5 text-left"
                  >
                    {/* Active cue — a hairline accent that wipes down the row's leading edge. */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-0 top-0 h-full w-[2px] origin-top bg-orange transition-transform duration-300 ease-out',
                        on ? 'scale-y-100' : 'scale-y-0',
                      )}
                    />
                    <span
                      className={cn(
                        'relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 transition-all duration-300',
                        on ? 'ring-orange' : 'ring-white/10',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partner.image}
                        alt=""
                        className={cn(
                          'h-full w-full object-cover transition-all duration-500 ease-out',
                          on ? 'scale-100 grayscale-0' : 'scale-105 opacity-70 grayscale',
                        )}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block font-sans font-bold tracking-tight transition-all duration-300',
                          on ? 'translate-x-1 text-white' : 'text-white/55',
                        )}
                        style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)' }}
                      >
                        {partner.name}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block text-sm transition-colors duration-300',
                          on ? 'text-orange' : 'text-white/30',
                        )}
                      >
                        {partner.reach} {partner.reachLabel.toLowerCase()}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Spotlight: fills the column height; illustrative frame grows to match the ledger,
               with one bold reach figure as the focal point over a caption plate. ── */}
          <div className="sd-reveal flex h-full flex-col">
            <div className="relative min-h-[19rem] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10">
              {PARTNERS.map((partner, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={partner.name}
                  src={partner.image}
                  alt=""
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
                    active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
              {/* Caption plate — partner name overline + the one bold focal element (reach). */}
              <div
                key={active}
                className="absolute inset-x-6 bottom-6 motion-safe:animate-[tier-rise_500ms_ease-out_both]"
              >
                <span className="block font-sans text-sm font-semibold text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
                  {p.name}
                </span>
                <span
                  className="mt-1 block font-sans font-black leading-[0.85] tabular-nums text-orange [text-shadow:0_2px_22px_rgba(0,0,0,0.65)]"
                  style={{ fontSize: 'clamp(2.75rem, 7vw, 4.75rem)' }}
                >
                  {p.reach}
                </span>
                <span className="mt-1 block font-sans text-sm font-semibold text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
                  {p.reachLabel}
                </span>
              </div>
            </div>

            <div key={`d-${active}`} className="mt-6 shrink-0 motion-safe:animate-[tier-rise_450ms_ease-out_both]">
              <p className="max-w-xl text-[0.95rem] leading-relaxed text-white/70 md:text-base">
                {p.blurb}
              </p>
              {/* Spec-sheet metrics — hairline-separated, reads as a media dossier, not a card. */}
              <div className="mt-6 flex items-stretch border-t border-white/10 pt-5">
                {p.metrics.map((m, i) => (
                  <div
                    key={m.label}
                    className={cn('flex-1', i > 0 && 'border-l border-white/10 pl-6')}
                  >
                    <span className="block font-sans text-xl font-bold text-white md:text-2xl">
                      {m.value}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/45">{m.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/45">
                <span className="text-white/70">Typical work: </span>
                {p.example}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
