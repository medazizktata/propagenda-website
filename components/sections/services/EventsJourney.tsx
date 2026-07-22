'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';

// The signature module for Events — a scroll-driven run-of-show. The event lifecycle is laid out
// as a vertical programme rail on the left (Brief → Branding → Production → Promotion → Show day →
// Wrap). The section PINS and the timeline is scrubbed by scroll: as the visitor scrolls down, the
// rail fills, the active marker advances phase by phase, and the show panel on the right crossfades
// a real event frame (the one bold focal element) with its copy. Reduced-motion / no-scrub falls
// back to a plain, fully readable static programme with a single anchor image.
// Event imagery is TEMPORARY portfolio placeholder until real /images/services/events assets land.
type Phase = {
  name: string;
  marker: string;
  lead: string;
  body: string;
  image: string;
};

const PHASES: Phase[] = [
  {
    name: 'Brief & concept',
    marker: '6 weeks out',
    lead: 'Where it starts',
    body: 'We sit down with you to shape the idea — the goal, the audience, the format, the budget, and the feeling people should leave with. Everything downstream is built on this brief.',
    image: '/images/portfolio/work-events.png',
  },
  {
    name: 'Branding & identity',
    marker: '5 weeks out',
    lead: 'A look of its own',
    body: 'The event gets an identity of its own — a name treatment, colour, and key visual that tie the room, the screens, and the socials into one recognisable through-line.',
    image: '/images/portfolio/work-ghaftree.png',
  },
  {
    name: 'Production & build',
    marker: '3 weeks out',
    lead: 'Into the room',
    body: 'Stage, signage, print, and every physical touchpoint are designed, produced, and readied — alongside the run-of-show that keeps the day on rails.',
    image: '/images/portfolio/work-restaurant.png',
  },
  {
    name: 'Promotion',
    marker: '2 weeks out',
    lead: 'Filling the room',
    body: 'The build-up: teasers, invites, and a social countdown that gets the right people talking, and turning up on the day.',
    image: '/images/portfolio/work-quickcars.png',
  },
  {
    name: 'Show day',
    marker: 'Event day',
    lead: 'The day itself',
    body: 'We run the floor end to end — logistics, timings, and on-site coordination — while our team captures every moment on camera and posts it as it happens.',
    image: '/images/portfolio/work-sanapex.png',
  },
  {
    name: 'Wrap & evaluation',
    marker: 'Afterwards',
    lead: 'What we learned',
    body: 'Edited photo and video delivered, a recap posted, and an honest read on what worked — measured against the goals we set on day one.',
    image: '/images/portfolio/work-food.png',
  },
];

const num = (i: number) => String(i + 1).padStart(2, '0');

// Rail geometry — one row per phase; the node sits at each row's vertical centre, so the
// continuous track runs from the first node's centre to the last node's centre.
const ROW_REM = 4.25;
const RAIL_HEIGHT_REM = ROW_REM * PHASES.length;
/** Reserved body copy — always two lines of `text-base` + `leading-relaxed` (no layout jump). */
const BODY_COPY_MIN_H = '3.25rem';

export function EventsJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const n = PHASES.length;

  // Pin the section and scrub the timeline with scroll progress: the fill line grows, the marker
  // advances, and the show panel crossfades. Nothing here runs (or pins) under reduced motion.
  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        // ~0.8 viewport of scroll per phase gap — a comfortable distance to scrub all phases.
        end: () => `+=${Math.round(window.innerHeight * (n - 1) * 0.8)}`,
        pin,
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          setActive(Math.min(n - 1, Math.floor(self.progress * n)));
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reducedMotion, n]);

  // Clickable phase nodes scroll the page to that phase's segment of the pinned scrub.
  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const top = st.start + ((i + 0.5) / n) * (st.end - st.start);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // ── Reduced-motion / no-scrub fallback: a plain, fully readable static programme. Every phase
  // is listed on a static rail with its copy, anchored by a single event frame — never blank,
  // never stuck on one phase. ──
  if (reducedMotion) {
    return (
      <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto max-w-6xl">
          <SectionLabel className="mb-4">The run of show</SectionLabel>
          <h2
            className="mb-10 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
          >
            From the brief to the final frame.
          </h2>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_1.1fr] lg:gap-14">
            {/* Single anchor frame — one bold focal image for the whole programme. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 sm:aspect-[16/10] lg:sticky lg:top-24 lg:self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHASES[0].image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
            </div>

            {/* Every phase, listed on a static rail. */}
            <ol className="relative flex flex-col">
              <span
                aria-hidden
                className="absolute left-[9px] top-6 bottom-6 w-px -translate-x-1/2 bg-white/12"
              />
              {PHASES.map((p) => (
                <li key={p.name} className="relative flex gap-4 border-b border-white/10 py-5 last:border-b-0">
                  <span className="relative z-content mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    <span className="h-3 w-3 rounded-full border-2 border-orange bg-orange" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs tabular-nums text-orange">{p.marker}</span>
                    <h3
                      className="font-sans font-bold tracking-tight text-white"
                      style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.3rem)' }}
                    >
                      {p.name}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/65">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  const phase = PHASES[active];
  const railTopRem = ROW_REM / 2;
  const railSpanRem = ROW_REM * (n - 1);

  return (
    <section ref={wrapRef} className="relative">
      {/* Pinned stage — held in place while scroll scrubs the timeline. */}
      <div
        ref={pinRef}
        className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-gutter-m py-16 lg:px-gutter-d"
      >
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto w-full max-w-6xl">
          <SectionLabel className="mb-4">The run of show</SectionLabel>
          <h2
            className="mb-3 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
          >
            From the brief to the final frame.
          </h2>
          {/* Scroll affordance — quietly guides the visitor, then fades once the scrub begins. */}
          <p
            className="mb-9 max-w-md text-sm leading-relaxed text-white/45 transition-opacity duration-500"
            style={{ opacity: progress > 0.02 ? 0 : 1 }}
          >
            Keep scrolling to move through the run of show, phase by phase.
          </p>

          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_1.18fr] lg:items-stretch lg:gap-14"
            style={{ minHeight: `${RAIL_HEIGHT_REM}rem` }}
          >
            {/* ── Programme rail: a continuous fill scrubs with scroll while the marker advances ── */}
            <div className="relative flex h-full flex-col" style={{ minHeight: `${RAIL_HEIGHT_REM}rem` }}>
              {/* Track + orange fill — the fill height tracks scroll progress continuously. */}
              <span
                aria-hidden
                className="absolute left-[9px] w-px -translate-x-1/2 bg-white/12"
                style={{ top: `${railTopRem}rem`, height: `${railSpanRem}rem` }}
              />
              <span
                aria-hidden
                className="absolute left-[9px] w-px -translate-x-1/2 bg-orange"
                style={{ top: `${railTopRem}rem`, height: `${progress * railSpanRem}rem` }}
              />
              {PHASES.map((p, i) => {
                const on = active === i;
                const done = i <= active;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={on ? 'step' : undefined}
                    className="group/ph relative z-content flex h-[4.25rem] w-full items-center gap-4 text-left"
                  >
                    {/* Node — the moving marker pulses on the active phase; fills once passed. */}
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

            {/* ── Show panel: fixed height = rail; image flexes, body locked to 2 lines ── */}
            <div
              className="flex h-full min-h-0 flex-col"
              style={{ minHeight: `${RAIL_HEIGHT_REM}rem` }}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
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
                    className="block font-sans font-bold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] transition-opacity duration-500"
                    style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.25rem)' }}
                  >
                    {phase.name}
                  </span>
                </div>
              </div>

              <p
                className="mt-6 shrink-0 line-clamp-2 text-base leading-relaxed text-white/70"
                style={{ minHeight: BODY_COPY_MIN_H }}
              >
                {phase.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
