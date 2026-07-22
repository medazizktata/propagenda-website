'use client';

import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';

// The signature module for Events — an interactive run-of-show. The event lifecycle is laid out
// as a vertical programme rail on the left (Brief → Branding → Production → Promotion → Show day →
// Wrap); selecting or scrubbing a phase moves the marker down the rail and crossfades the show
// panel on the right, where a real event frame is the one bold focal element and the checklist
// deliverables that land in that phase are called out. Event imagery is TEMPORARY portfolio
// placeholder until real /images/services/events assets land.
type Phase = {
  name: string;
  marker: string;
  lead: string;
  body: string;
  lands: string[];
  image: string;
};

const PHASES: Phase[] = [
  {
    name: 'Brief & concept',
    marker: '6 weeks out',
    lead: 'Where it starts',
    body: 'We sit down with you to shape the idea — the goal, the audience, the format, the budget, and the feeling people should leave with. Everything downstream is built on this brief.',
    lands: ['Full organisation'],
    image: '/images/portfolio/work-events.png',
  },
  {
    name: 'Branding & identity',
    marker: '5 weeks out',
    lead: 'A look of its own',
    body: 'The event gets an identity of its own — a name treatment, colour, and key visual that tie the room, the screens, and the socials into one recognisable through-line.',
    lands: ['Re-branding'],
    image: '/images/portfolio/work-ghaftree.png',
  },
  {
    name: 'Production & build',
    marker: '3 weeks out',
    lead: 'Into the room',
    body: 'Stage, signage, print, and every physical touchpoint are designed, produced, and readied — alongside the run-of-show that keeps the day on rails.',
    lands: ['Marketing materials production', 'Full organisation'],
    image: '/images/portfolio/work-restaurant.png',
  },
  {
    name: 'Promotion',
    marker: '2 weeks out',
    lead: 'Filling the room',
    body: 'The build-up: teasers, invites, and a social countdown that gets the right people talking, and turning up on the day.',
    lands: ['Social media marketing'],
    image: '/images/portfolio/work-quickcars.png',
  },
  {
    name: 'Show day',
    marker: 'Event day',
    lead: 'The day itself',
    body: 'We run the floor end to end — logistics, timings, and on-site coordination — while our team captures every moment on camera and posts it as it happens.',
    lands: ['Full organisation', 'Photography & videography', 'Social media marketing'],
    image: '/images/portfolio/work-sanapex.png',
  },
  {
    name: 'Wrap & evaluation',
    marker: 'Afterwards',
    lead: 'What we learned',
    body: 'Edited photo and video delivered, a recap posted, and an honest read on what worked — measured against the goals we set on day one.',
    lands: ['Photography & videography', 'Social media marketing'],
    image: '/images/portfolio/work-food.png',
  },
];

const num = (i: number) => String(i + 1).padStart(2, '0');

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EventsJourney() {
  const [active, setActive] = useState(0);
  const n = PHASES.length;
  const phase = PHASES[active];

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">The run of show</SectionLabel>
        <h2
          className="sd-reveal mb-10 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          From the brief to the final frame.
        </h2>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_1.18fr] lg:gap-14">
          {/* ── Programme rail: the event lifecycle, scrubbed by a moving marker ── */}
          <div className="sd-reveal flex flex-col">
            {PHASES.map((p, i) => {
              const on = active === i;
              const done = i <= active;
              return (
                <button
                  key={p.name}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group/ph relative flex h-[4.25rem] w-full items-center gap-4 text-left"
                >
                  {/* Connector down to the next node — orange once this phase has passed. */}
                  {i < n - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-[9px] top-1/2 h-[4.25rem] w-px -translate-x-1/2 transition-colors duration-500',
                        i < active ? 'bg-orange' : 'bg-white/12',
                      )}
                    />
                  )}
                  {/* Node — the moving marker pulses on the active phase. */}
                  <span className="relative z-content flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    {on && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full ring-2 ring-orange/40 motion-safe:animate-ping"
                      />
                    )}
                    <span
                      className={cn(
                        'h-3 w-3 rounded-full border-2 transition-all duration-300',
                        done ? 'scale-110 border-orange bg-orange' : 'border-white/30 bg-charcoal',
                      )}
                    />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-xs tabular-nums transition-colors duration-300',
                        on ? 'text-orange' : 'text-white/40',
                      )}
                    >
                      {p.marker}
                    </span>
                    <span
                      className={cn(
                        'block font-sans font-bold tracking-tight transition-all duration-300',
                        on ? 'translate-x-0.5 text-white' : 'text-white/55',
                      )}
                      style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.3rem)' }}
                    >
                      {p.name}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Show panel: a real event frame (the bold anchor) + what lands in this phase ── */}
          <div className="sd-reveal">
            {/* Crossfading event frame — one bold focal element per phase. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 sm:aspect-[16/10]">
              {PHASES.map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.name}
                  src={p.image}
                  alt=""
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
                    active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
              <span className="absolute right-5 top-5 font-mono text-xs tabular-nums text-white/70">
                {num(active)} / {num(n - 1)}
              </span>
              <div className="absolute inset-x-5 bottom-5">
                <span className="block text-sm text-orange">{phase.lead}</span>
                <span
                  key={active}
                  className="block font-sans font-bold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] motion-safe:animate-[tier-rise_450ms_ease-out_both]"
                  style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.25rem)' }}
                >
                  {phase.name}
                </span>
              </div>
            </div>

            {/* Phase detail — crossfades with the marker. */}
            <div key={`d-${active}`} className="motion-safe:animate-[tier-rise_450ms_ease-out_both]">
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">{phase.body}</p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <span className="text-sm text-white/40">What lands in this phase</span>
                <ul className="mt-3.5 flex flex-wrap gap-x-7 gap-y-2.5">
                  {phase.lands.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 text-[0.95rem] font-medium text-white/85">
                      <CheckGlyph className="h-4 w-4 shrink-0 text-orange" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
