'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ServiceRecord, ServiceSlug } from '@/types/content';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { LogoDrawMark } from '@/components/molecules/LogoDrawMark';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { ServicesCTA } from '@/components/sections/services/ServicesCTA';
import { ServiceNextPrev } from '@/components/sections/services/ServiceNextPrev';
import { ServiceWorkGrid } from '@/components/sections/services/ServiceWorkGrid';
import { PrInfluenceRoster } from '@/components/sections/services/PrInfluenceRoster';
import { serviceDetailConfig } from '@/components/sections/services/serviceDetailConfig';

// Real client logos (temporary curated proof strip — shown on light chips so they read on
// the dark surface). Same honest "trusted by" set across detail pages.
const PROOF_LOGOS = [
  { name: 'Sanapex Interiors', src: '/images/clients/sanapex-interiors.png' },
  { name: 'P2P Motors', src: '/images/clients/p2p-motors.png' },
  { name: 'Centralhub', src: '/images/clients/centralhub.png' },
  { name: 'Ghaf Tree', src: '/images/clients/ghaf-tree.png' },
  { name: 'Dr. Shifa', src: '/images/clients/dr-shifa.png' },
  { name: 'OU Optics', src: '/images/clients/ou-optics.png' },
];

const num = (i: number) => String(i + 1).padStart(2, '0');

// "What's included" gets a layout unique to each service type, chosen so it never mirrors
// that service's signature module below it.
type ScopeVariant = 'editorial' | 'grid' | 'ledger';
const SCOPE_VARIANT: Record<ServiceSlug, ScopeVariant> = {
  'branding-visual-identity': 'editorial',
  'public-relations': 'grid',
  'online-offline-marketing': 'ledger',
  'graphics-production': 'ledger',
  websites: 'grid',
  'mobile-applications': 'grid',
  events: 'editorial',
  'photography-videography': 'editorial',
};

// Temporary imagery for the visual discipline tiles (photography/videography types).
const DISCIPLINE_IMAGES = [
  '/images/portfolio/work-food.png',
  '/images/portfolio/work-restaurant.png',
  '/images/portfolio/work-events.png',
  '/images/portfolio/work-sanapex.png',
  '/images/portfolio/work-quickcars.png',
  '/images/portfolio/work-ghaftree.png',
];

export function ServiceDetailContent({ service }: { service: ServiceRecord }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const cfg = serviceDetailConfig[service.slug];

  // Always show exactly 3 related-work cards: the service's own related work first, padded
  // from a safe pool (links to the work hub), de-duped by label.
  const relatedThree = [
    ...(service.relatedWork ?? []),
    { label: 'Sanapex Interiors', href: '/work' },
    { label: 'Quick Cars', href: '/work' },
    { label: 'Darabzeen Al Ward', href: '/work' },
    { label: 'BIL Events', href: '/work' },
  ]
    .filter((v, i, a) => a.findIndex((x) => x.label === v.label) === i)
    .slice(0, 3);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.sd-reveal');
      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="bg-charcoal">
      {/* ── HERO (SMV project-detail composition: centred title + tagline + scroll cue) ─── */}
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-charcoal px-gutter-m py-28 text-center lg:px-gutter-d">
        {cfg.heroImage ? (
          <div aria-hidden className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cfg.heroImage} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-charcoal/[0.55]" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/60" />
          </div>
        ) : (
          <div aria-hidden className="pattern-section-fade absolute inset-0">
            <BrandPattern variant="dense" half="right" className="opacity-25" />
          </div>
        )}

        {/* Breadcrumb — top-left; the "Services" link already navigates back (no separate arrow). */}
        <nav
          aria-label="Breadcrumb"
          className="sd-reveal absolute left-gutter-m top-24 z-content flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60 lg:left-gutter-d"
        >
          <Link href="/services" className="transition-hover hover-fine:hover:text-orange">
            Services
          </Link>
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3 w-3 shrink-0 text-orange">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white">{service.title}</span>
        </nav>

        <div className="relative z-content flex max-w-4xl flex-col items-center">
          <h1
            className="sd-reveal font-sans font-bold uppercase leading-[0.9] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(2.4rem, 8.5vw, 7rem)' }}
          >
            {service.h1}
            <span className="text-orange">.</span>
          </h1>
          <p className="sd-reveal mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/80 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] md:text-lg">
            {service.overview}
          </p>
          <div className="sd-reveal mt-9">
            <Button href="/contact" variant="primary" size="lg">
              Start a project &rarr;
            </Button>
          </div>
        </div>

        {/* Scroll cue — scrolls to the content below the hero. */}
        <button
          type="button"
          aria-label="Scroll to details"
          onClick={() =>
            window.scrollTo({ top: Math.round(window.innerHeight * 0.9), behavior: 'smooth' })
          }
          className="sd-reveal absolute bottom-10 left-1/2 z-content flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-orange text-orange transition-hover hover-fine:hover:bg-orange hover-fine:hover:text-navy motion-safe:animate-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* ── SCOPE — branding gets the reveal list + bento; PR gets the media-forward reveal
           list on its own; others the variant grid ── */}
      {service.slug === 'branding-visual-identity' ? (
        <>
          <ScopeReveal items={service.scopeItems} />
          <ScopeBento items={service.scopeItems} />
        </>
      ) : service.slug === 'public-relations' ? (
        <ScopeReveal items={service.scopeItems} />
      ) : (
        <ServiceScope service={service} />
      )}

      {/* ── HOW WE WORK (interactive process stepper — services with an authored approach) ── */}
      {cfg.approach && cfg.approach.length > 0 && <ServiceApproach phases={cfg.approach} />}

      {/* ── SIGNATURE MODULE (adapts per service) ────────────────────────── */}
      <SignatureModule service={service} />

      {/* ── SELECTED WORK (SMV-style image grid) ─────────────────────────── */}
      <ServiceWorkGrid />

      {/* ── TRUSTED BY (logo marquee) ────────────────────────────────────── */}
      <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto max-w-6xl">
          <SectionLabel className="sd-reveal mb-8">Trusted by</SectionLabel>
          <div className="sd-reveal relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
            <div className="flex w-max animate-[marquee_32s_linear_infinite] motion-reduce:animate-none">
              {[...PROOF_LOGOS, ...PROOF_LOGOS].map((logo, i) => (
                <span
                  key={`${logo.name}-${i}`}
                  className="mx-2 flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-white/90 px-6 py-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (services with authored questions) ───────────────────────── */}
      {cfg.faqs && cfg.faqs.length > 0 && <ServiceFAQ faqs={cfg.faqs} />}

      {/* ── RELATED WORK (visual thumbnails, after the FAQ) ──────────────── */}
      <ServiceRelatedWork items={relatedThree} />

      {/* ── NEXT / PREV (SMV project-detail signature) ───────────────────── */}
      <ServiceNextPrev slug={service.slug} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <ServicesCTA heading={cfg.ctaHeading} tertiary={service.tertiaryCta} />
    </div>
  );
}

/* ───────────────────────── Scope ("What's included") ───────────────────────── */

// Branding "What's included" — supplementary icons + preview imagery, by scope-item index.
const SCOPE_ICONS = ['shapes', 'layers', 'type', 'file', 'book', 'mail'];
const SCOPE_IMAGES = [
  '/images/portfolio/work-sanapex.png',
  '/images/portfolio/work-ghaftree.png',
  '/images/portfolio/work-restaurant.png',
  '/images/portfolio/work-quickcars.png',
  '/images/portfolio/work-events.png',
  '/images/portfolio/work-food.png',
];
const SCOPE_BLURBS = [
  'A distinctive primary mark, built to last.',
  'Colour, type and graphics as one connected system.',
  'A palette and type scale with real usage rules.',
  'Polished company profiles that introduce you well.',
  'Every rule documented, so the brand stays consistent.',
  'Cards, letterheads and the everyday essentials.',
];

// Option 1 — editorial hover-reveal list: hover a deliverable, its preview fades in (SMV-style).
function ScopeReveal({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-8">What&apos;s included</SectionLabel>
        <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
          <ul className="sd-reveal flex flex-col">
            {items.map((item, i) => {
              const on = active === i;
              return (
                <li key={item} onMouseEnter={() => setActive(i)}>
                  <button
                    type="button"
                    onFocus={() => setActive(i)}
                    className="flex w-full items-center gap-5 border-b border-white/10 py-5 text-left"
                  >
                    <span
                      className={cn(
                        'text-sm font-bold tabular-nums transition-colors duration-300',
                        on ? 'text-orange' : 'text-white/30',
                      )}
                    >
                      {num(i)}
                    </span>
                    <span
                      className={cn(
                        'font-sans font-bold tracking-tight transition-all duration-300',
                        on ? 'translate-x-1 text-white' : 'text-white/55',
                      )}
                      style={{ fontSize: 'clamp(1.25rem, 2.8vw, 2rem)' }}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="sd-reveal relative hidden aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 md:block">
            {items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item}
                src={SCOPE_IMAGES[i % SCOPE_IMAGES.length]}
                alt=""
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
                  active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <span className="absolute inset-x-5 bottom-5 font-sans text-lg font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
              {items[active]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Option 2 — asymmetric bento: one feature tile + smaller icon tiles.
function ScopeBento({ items }: { items: string[] }) {
  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-8">At a glance</SectionLabel>
        <div className="grid auto-rows-[minmax(9rem,1fr)] grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item}
              className={cn(
                'group/bt sd-reveal relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition-all duration-300 ease-out hover-fine:hover:-translate-y-1 hover-fine:hover:ring-orange/40',
                i === 0 && 'md:col-span-2 md:row-span-2',
              )}
            >
              <BrandPattern
                variant="dense"
                className="!opacity-[0.04] transition-opacity duration-500 group-hover/bt:!opacity-[0.09]"
              />
              <span
                className={cn(
                  'relative flex items-center justify-center rounded-xl bg-orange/10 text-orange transition-all duration-300 group-hover/bt:scale-105 group-hover/bt:bg-orange/20',
                  i === 0 ? 'h-12 w-12' : 'h-10 w-10',
                )}
              >
                <DeliverableIcon icon={SCOPE_ICONS[i % SCOPE_ICONS.length]} className={i === 0 ? 'h-6 w-6' : 'h-5 w-5'} />
              </span>
              <div className="relative">
                <span className={cn('block font-sans font-bold text-white', i === 0 ? 'text-2xl' : 'text-lg')}>
                  {item}
                </span>
                <span
                  className={cn(
                    'mt-2 block leading-relaxed text-white/50',
                    i === 0 ? 'max-w-sm text-base' : 'text-sm',
                  )}
                >
                  {SCOPE_BLURBS[i % SCOPE_BLURBS.length]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceScope({ service }: { service: ServiceRecord }) {
  if (service.scopeItems.length === 0) return null;
  const variant = SCOPE_VARIANT[service.slug];
  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-8">What&apos;s included</SectionLabel>
        {variant === 'editorial' && <ScopeEditorial items={service.scopeItems} />}
        {variant === 'grid' && <ScopeGrid items={service.scopeItems} />}
        {variant === 'ledger' && <ScopeLedger items={service.scopeItems} />}
      </div>
    </section>
  );
}

// Bold, identity-forward: big ghost numbers + heavy rows (branding, photography).
function ScopeEditorial({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={item}
          className="sd-reveal group/sc flex items-center gap-6 border-b border-white/10 py-5 md:gap-10"
        >
          <span
            className="font-sans font-black leading-none text-white/[0.1] transition-colors duration-300 group-hover/sc:text-orange/30"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
          >
            {num(i)}
          </span>
          <span
            className="font-sans font-bold uppercase tracking-tight text-white transition-all duration-300 group-hover/sc:translate-x-2 group-hover/sc:text-orange"
            style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.9rem)' }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

// Systematic multi-column index (marketing-adjacent digital services). Circular number chips
// that fill orange on hover — same node motif as the process rail, for a cohesive language.
function ScopeGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item}
          className="sd-reveal group/sc flex items-center gap-4 border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:border-orange/50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-bold tabular-nums text-orange transition-all duration-300 group-hover/sc:border-orange group-hover/sc:bg-orange group-hover/sc:text-navy">
            {num(i)}
          </span>
          <span className="font-sans text-base font-semibold uppercase tracking-tight text-white transition-all duration-300 group-hover/sc:translate-x-1 group-hover/sc:text-orange md:text-lg">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

// Spec-sheet ledger with column rule + trailing marker (print/production services).
function ScopeLedger({ items }: { items: string[] }) {
  return (
    <div className="grid border-t border-white/15 sm:grid-cols-2">
      {items.map((item, i) => (
        <div
          key={item}
          className="sd-reveal group/sc flex items-center justify-between gap-4 border-b border-white/10 py-4 transition-colors duration-300 hover-fine:hover:bg-white/[0.03] sm:px-6 sm:odd:border-r sm:odd:border-r-white/10"
        >
          <span className="flex items-center gap-4">
            <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
            <span className="font-sans font-semibold uppercase tracking-tight text-white md:text-lg">
              {item}
            </span>
          </span>
          <span
            aria-hidden
            className="text-orange/60 transition-transform duration-300 group-hover/sc:translate-x-1"
          >
            &rarr;
          </span>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Signature modules ───────────────────────── */

// "How we work" — a pinned timeline you scrub with scroll (SMV-style). As the section pins,
// scroll progress drives a giant phase number, the detail, and a filling rail; nodes are also
// clickable to jump. Reduced-motion falls back to a plain list.
function ServiceApproach({ phases }: { phases: { title: string; body: string }[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const n = phases.length;

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (n - 1) * 0.8)}`,
        pin: pin,
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          setActive(Math.min(n - 1, Math.floor(self.progress * n)));
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reducedMotion, n]);

  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const top = st.start + ((i + 0.5) / n) * (st.end - st.start);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Reduced-motion / no-scrub fallback: a plain readable list.
  if (reducedMotion) {
    return (
      <ModuleShell label="How we work" title="From brief to launch.">
        <ol className="flex flex-col">
          {phases.map((p, i) => (
            <li key={p.title} className="flex gap-5 border-t border-white/10 py-5 first:border-t-0">
              <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
              <div>
                <h3 className="font-sans text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-1 leading-relaxed text-white/70">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </ModuleShell>
    );
  }

  const cur = phases[active];
  const half = 100 / (2 * n);

  return (
    <section ref={wrapRef} className="relative">
      <div
        ref={pinRef}
        className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden px-gutter-m py-16 lg:px-gutter-d"
      >
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto w-full max-w-6xl">
          <SectionLabel className="mb-4">How we work</SectionLabel>
          <h2
            className="mb-12 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
          >
            From brief to launch.
          </h2>

          {/* Giant scrubbing number + the active phase. */}
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
            <span
              className="font-sans font-black leading-[0.8] text-orange/90 tabular-nums"
              style={{ fontSize: 'clamp(5rem, 15vw, 12rem)' }}
            >
              {num(active)}
            </span>
            <div>
              <span className="text-sm text-white/40">
                Phase {active + 1} of {n}
              </span>
              <h3
                key={active}
                className="mt-2 animate-[tier-rise_400ms_ease-out_both] font-sans text-3xl font-bold text-white lg:text-5xl"
              >
                {cur.title}
              </h3>
              <p
                key={`b-${active}`}
                className="mt-4 max-w-xl animate-[tier-rise_400ms_ease-out_both] text-base leading-relaxed text-white/70 lg:text-lg"
              >
                {cur.body}
              </p>
            </div>
          </div>

          {/* Progress rail — fills continuously with scroll; nodes jump. */}
          <div className="relative mt-16">
            <div
              aria-hidden
              className="absolute top-1.5 h-px bg-white/12"
              style={{ left: `${half}%`, right: `${half}%` }}
            />
            <div
              aria-hidden
              className="absolute top-1.5 h-px bg-orange"
              style={{ left: `${half}%`, width: `${progress * (100 - 2 * half)}%` }}
            />
            <div className="relative flex justify-between">
              {phases.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="group/step flex flex-1 flex-col items-center gap-3"
                >
                  <span
                    className={cn(
                      'relative z-content h-3 w-3 rounded-full border-2 transition-all duration-300',
                      i <= active ? 'scale-110 border-orange bg-orange' : 'border-white/30 bg-charcoal',
                    )}
                  />
                  <span
                    className={cn(
                      'hidden text-xs transition-colors duration-300 sm:block',
                      i === active ? 'text-orange' : 'text-white/40 group-hover/step:text-white/70',
                    )}
                  >
                    {p.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Temporary thumbnails for related-work cards (until real per-project images land).
const RELATED_IMAGES = [
  '/images/portfolio/work-sanapex.png',
  '/images/portfolio/work-quickcars.png',
  '/images/portfolio/work-ghaftree.png',
  '/images/portfolio/work-events.png',
  '/images/portfolio/work-restaurant.png',
  '/images/portfolio/work-food.png',
];

// Related work — visual thumbnail cards (image + title), grayscale→colour on hover.
function ServiceRelatedWork({ items }: { items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-8">Related work</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((rw, i) => (
            <Link
              key={`${rw.href}-${i}`}
              href={rw.href}
              className="group/rw sd-reveal relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-300 hover-fine:hover:ring-orange/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={RELATED_IMAGES[i % RELATED_IMAGES.length]}
                alt=""
                className="h-full w-full object-cover grayscale-[0.35] transition-all duration-500 ease-out group-hover/rw:scale-105 group-hover/rw:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <span className="absolute inset-x-4 bottom-4 font-sans text-base font-bold tracking-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
                {rw.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ accordion — sentence-case questions, a plus→× toggle, one panel open at a time.
function ServiceFAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ModuleShell label="FAQ" title="Common questions.">
      <div className="sd-reveal">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-t border-white/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    'font-sans text-base font-semibold transition-colors duration-200 md:text-lg',
                    isOpen ? 'text-orange' : 'text-white',
                  )}
                >
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'relative flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ease-out',
                    isOpen && 'rotate-45',
                  )}
                >
                  <span className="absolute h-0.5 w-3.5 rounded-full bg-orange" />
                  <span className="absolute h-3.5 w-0.5 rounded-full bg-orange" />
                </span>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pr-8 text-[0.95rem] leading-relaxed text-white/65">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModuleShell>
  );
}

function SignatureModule({ service }: { service: ServiceRecord }) {
  const cfg = serviceDetailConfig[service.slug];

  if (service.slug === 'graphics-production') return <DpiBand />;
  if (service.slug === 'public-relations') return <PrInfluenceRoster />;
  if (service.tiers && service.tiers.length > 0) return <TierCards service={service} />;
  if (service.eventChecklist && service.eventChecklist.length > 0)
    return <ChecklistGrid items={service.eventChecklist} />;
  if (service.extendedBullets && service.extendedBullets.length > 0)
    return <FocusBento items={service.extendedBullets} />;
  if (cfg.process) return <ProcessSteps steps={cfg.process} />;
  if (cfg.disciplines) return <DisciplineSplit disciplines={cfg.disciplines} />;
  if (cfg.influence) return <InfluenceList items={cfg.influence} />;
  return null;
}

function ModuleShell({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">{label}</SectionLabel>
        {title && (
          <h2
            className="sd-reveal mb-8 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

const KIT_SWATCHES: [string, string][] = [
  ['#F58B27', 'bg-orange'],
  ['#0F151F', 'bg-navy'],
  ['#252525', 'bg-charcoal'],
  ['#FFFFFF', 'bg-white'],
];

// Per-level framing so Basic and Developed read as genuinely different offers, not the same
// board twice. Basic is the lean foundation; Developed is a superset ("Everything in Basic,
// plus…"). Each deliverable carries an icon so the list reads visually, not as text rows.
type Deliverable = { label: string; icon: string; sample?: string };

const TIER_META: { summary: string; tagline: string; deliverables: Deliverable[] }[] = [
  {
    summary: 'The essentials, ready to launch.',
    tagline: 'A clean, consistent identity — the foundation your brand runs on.',
    deliverables: [
      { label: 'Business card', icon: 'card' },
      { label: 'Letterhead', icon: 'file' },
      { label: 'Envelopes', icon: 'mail' },
    ],
  },
  {
    summary: 'The complete system, end to end.',
    tagline: 'Everything in Basic — plus the voice, messaging, and materials to run the whole brand.',
    // Fully-fledged modules: each carries a sample so Developed reads as a real, complete
    // brand book — not the same board as Basic with two extra rows.
    deliverables: [
      { label: 'Brand voice', icon: 'voice', sample: 'Confident · Bold · Human' },
      { label: 'Messaging & tone', icon: 'message', sample: '“The whole brand, one studio.”' },
      { label: 'Brand values', icon: 'compass', sample: 'Craft · Clarity · Momentum' },
      { label: 'Marketing materials', icon: 'layers', sample: 'Social, print & ad templates' },
      { label: 'Brand guidelines', icon: 'book', sample: 'The full brand book, documented' },
      { label: 'Full stationery', icon: 'mail', sample: 'Every touchpoint, on-brand' },
    ],
  },
];

/** Line icon for a brand deliverable tile (stroke, currentColor). */
function DeliverableIcon({ icon, className }: { icon: string; className?: string }) {
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
  switch (icon) {
    case 'card':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'voice':
      return (
        <svg {...common}>
          <path d="M2 10v4" />
          <path d="M6 7v10" />
          <path d="M10 4v16" />
          <path d="M14 9v6" />
          <path d="M18 6v12" />
          <path d="M22 10v4" />
        </svg>
      );
    case 'message':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'shapes':
      return (
        <svg {...common}>
          <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <circle cx="17.5" cy="17.5" r="3.5" />
        </svg>
      );
    case 'type':
      return (
        <svg {...common}>
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      );
    default:
      return null;
  }
}

function TierCards({ service }: { service: ServiceRecord }) {
  const tiers = service.tiers ?? [];
  // Nothing selected at first — the two levels show as large cards. Choosing one collapses the
  // cards and reveals the detail board below.
  const [selected, setSelected] = useState<number | null>(null);
  if (tiers.length === 0) return null;
  const chosen = selected !== null;
  const active = selected ?? 0;
  const tier = tiers[active];
  const meta = TIER_META[active] ?? {
    summary: '',
    tagline: '',
    deliverables: tier.items.map((label) => ({ label, icon: 'card' })),
  };

  return (
    <ModuleShell label="How we package it" title="Choose your level of brand.">
      <div className="flex flex-col gap-6">
        {/* ── Level selector — large until a level is chosen, then collapsed ── */}
        <div className="sd-reveal grid gap-4 sm:grid-cols-2">
          {tiers.map((t, i) => {
            const isActive = selected === i;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-2xl border text-left transition-all duration-500 ease-out',
                  chosen ? 'p-6' : 'p-8 lg:p-10',
                  isActive
                    ? 'border-orange bg-orange/[0.06]'
                    : chosen
                      ? 'border-white/10 hover-fine:hover:border-white/25'
                      : 'border-white/15 bg-white/[0.02] hover-fine:hover:border-orange/50 hover-fine:hover:bg-white/[0.03]',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          'font-bold tabular-nums transition-colors duration-500',
                          chosen ? 'text-xs' : 'text-sm',
                          isActive ? 'text-orange' : 'text-white/30',
                        )}
                      >
                        {num(i)}
                      </span>
                      <h3
                        className={cn(
                          'font-sans font-bold capitalize tracking-tight transition-all duration-500',
                          chosen ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl',
                          isActive ? 'text-white' : 'text-white/80',
                        )}
                      >
                        {t.name}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        'leading-snug text-white/45 transition-all duration-500',
                        chosen ? 'mt-2 text-sm' : 'mt-3 text-base',
                      )}
                    >
                      {TIER_META[i]?.summary}
                    </p>
                  </div>
                  {isActive ? (
                    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="mt-1 h-5 w-5 shrink-0 text-orange">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : !chosen ? (
                    <span className="shrink-0 text-sm font-semibold text-orange">Select</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prompt before a level is chosen. */}
        {!chosen && (
          <p className="sd-reveal text-sm text-white/40">Choose a level to preview what&apos;s inside.</p>
        )}

        {/* ── Brand board — revealed after selection ── */}
        {chosen && (
          <div
            key={active}
            className="relative animate-[tier-rise_500ms_ease-out_both] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015] p-6 lg:p-8"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]">
              <BrandPattern variant="tiled" />
            </div>
            <div className="relative">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/40">Kit preview</span>
                <span className="text-sm font-medium capitalize text-orange">{tier.name}</span>
              </div>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/60">{meta.tagline}</p>

              {active === 0 ? <BasicKit deliverables={meta.deliverables} /> : <DevelopedKit />}
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}

// ── Basic kit: the shared identity foundation + the stationery essentials. ──
function IdentityFoundation() {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,300px)_1fr]">
      <div className="flex animate-[tier-rise_500ms_ease-out_both] flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-charcoal to-navy py-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-monogram.svg" alt="" className="h-12 w-12 brightness-0 invert" />
        <span className="text-xs text-white/35">Logo</span>
      </div>
      <div className="flex flex-col justify-center gap-5">
        <div className="animate-[tier-rise_500ms_ease-out_both]">
          <div className="grid grid-cols-4 gap-2">
            {KIT_SWATCHES.map(([hex, bg]) => (
              <div key={hex} className="flex flex-col gap-1.5">
                <div className={cn('h-11 rounded-md ring-1 ring-white/10', bg)} />
                <span className="text-[0.6rem] tabular-nums text-white/35">{hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
          <div className="flex animate-[tier-rise_500ms_ease-out_both] items-center gap-3 rounded-lg bg-white/[0.02] p-4">
            <span className="font-sans text-4xl font-black leading-none text-white">Aa</span>
            <div>
              <span className="block text-sm font-semibold text-white">Poppins</span>
              <span className="block text-xs text-white/40">Display &amp; body</span>
            </div>
          </div>
          <div className="relative flex animate-[tier-rise_500ms_ease-out_both] items-end overflow-hidden rounded-lg bg-orange p-3">
            <BrandPattern variant="dense" className="opacity-20 [filter:brightness(0)]" />
            <span className="relative text-[0.7rem] font-semibold text-navy/80">Pattern</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliverableTile({ d, i }: { d: Deliverable; i: number }) {
  return (
    <div
      className="group/tile flex animate-[tier-rise_500ms_ease-out_both] flex-col gap-4 rounded-xl bg-white/[0.03] p-4 transition-all duration-300 ease-out hover-fine:hover:-translate-y-1 hover-fine:hover:bg-white/[0.06] hover-fine:hover:ring-1 hover-fine:hover:ring-orange/40"
      style={{ animationDelay: `${200 + i * 55}ms` }}
    >
      <DeliverableIcon
        icon={d.icon}
        className="h-5 w-5 text-orange transition-transform duration-300 ease-out group-hover/tile:scale-110"
      />
      <span className="text-sm font-medium leading-tight text-white transition-colors duration-300 group-hover/tile:text-orange">
        {d.label}
      </span>
    </div>
  );
}

function BasicKit({ deliverables }: { deliverables: Deliverable[] }) {
  return (
    <>
      <IdentityFoundation />
      <div className="mt-7 border-t border-white/10 pt-6">
        <span className="text-sm text-white/40">Also included</span>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {deliverables.map((d, i) => (
            <DeliverableTile key={d.label} d={d} i={i} />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Developed kit: a full brand-book preview — each addition is a real module. ──
function BrandModule({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[tier-rise_500ms_ease-out_both]">
      <div className="mb-3">
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="block text-xs text-white/40">{desc}</span>
      </div>
      {children}
    </div>
  );
}

function LogoTile({ tone }: { tone: 'dark' | 'orange' | 'light' }) {
  const bg =
    tone === 'dark' ? 'bg-gradient-to-br from-charcoal to-navy' : tone === 'orange' ? 'bg-orange' : 'bg-white';
  const filter = tone === 'dark' ? 'brightness-0 invert' : 'brightness-0';
  const caption = tone === 'dark' ? 'Primary' : tone === 'orange' ? 'Reversed' : 'Monochrome';
  const captionTone = tone === 'dark' ? 'text-white/35' : 'text-navy/55';
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-lg py-8 ring-1 ring-white/10', bg)}>
      {tone === 'dark' ? (
        // Primary mark draws itself into existence when the kit reveals.
        <LogoDrawMark className="h-12" color="#ffffff" animate />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/brand/logo-monogram.svg" alt="" className={cn('h-9', filter)} />
      )}
      <span className={cn('text-[0.6rem]', captionTone)}>{caption}</span>
    </div>
  );
}

// Interactive Poppins specimen — pick a weight and the sample re-renders in it.
const POPPINS_WEIGHTS = [
  { label: 'Light', cls: 'font-light' },
  { label: 'Regular', cls: 'font-normal' },
  { label: 'Semibold', cls: 'font-semibold' },
  { label: 'Bold', cls: 'font-bold' },
  { label: 'Black', cls: 'font-black' },
];

function TypeSpecimen() {
  const [w, setW] = useState(4);
  return (
    <div className="flex flex-col justify-center rounded-lg bg-white/[0.02] p-5">
      <span className={cn('font-sans text-3xl leading-none text-white', POPPINS_WEIGHTS[w].cls)}>Poppins</span>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-1">
        {POPPINS_WEIGHTS.map((pw, i) => (
          <button
            key={pw.label}
            type="button"
            onClick={() => setW(i)}
            aria-pressed={i === w}
            className={cn(
              'rounded px-2 py-1 font-sans text-sm transition-colors duration-200',
              pw.cls,
              i === w ? 'text-orange' : 'text-white/45 hover-fine:hover:text-white',
            )}
          >
            {pw.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Orange → neutral tint/shade ramp for the extended colour system.
const COLOUR_TINTS = ['#FBD1AD', '#F9BA80', '#F7A253', '#F58B27', '#606773', '#454C58', '#2A3240', '#0F151F'];
const TEMPLATE_MOCKS = [
  '/images/portfolio/work-events.png',
  '/images/portfolio/work-ghaftree.png',
  '/images/portfolio/work-restaurant.png',
];

function DevelopedKit() {
  return (
    <div className="mt-6 flex flex-col gap-8">
      <BrandModule label="Logo suite" desc="Primary, reversed and monochrome — one mark for every surface.">
        <div className="grid grid-cols-3 gap-3">
          <LogoTile tone="dark" />
          <LogoTile tone="orange" />
          <LogoTile tone="light" />
        </div>
      </BrandModule>

      <BrandModule label="Colour system" desc="Core hues plus a full tint and shade ramp, with values.">
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-4 gap-2">
            {KIT_SWATCHES.map(([hex, bg]) => (
              <div key={hex} className="flex flex-col gap-1.5">
                <div className={cn('h-11 rounded-md ring-1 ring-white/10', bg)} />
                <span className="text-[0.6rem] tabular-nums text-white/35">{hex}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {COLOUR_TINTS.map((hex, i) => (
              <div
                key={`${hex}-${i}`}
                className="h-6 rounded ring-1 ring-white/10"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      </BrandModule>

      <BrandModule label="Typography & pattern" desc="A weighted type scale to lead and support, plus the brand pattern.">
        <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
          <TypeSpecimen />
          <div className="relative flex min-h-[6rem] items-end overflow-hidden rounded-lg bg-orange p-4">
            <BrandPattern variant="dense" className="opacity-20 [filter:brightness(0)]" />
            <span className="relative text-[0.7rem] font-semibold text-navy/80">Pattern system</span>
          </div>
        </div>
      </BrandModule>

      <BrandModule label="Voice & messaging" desc="How the brand sounds, and the lines it leads with.">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.3fr]">
          <div className="rounded-lg bg-white/[0.02] p-5">
            <span className="text-xs text-white/40">Voice</span>
            <p className="mt-1.5 font-sans text-lg font-bold text-white">Confident. Bold. Human.</p>
          </div>
          <div className="rounded-lg bg-white/[0.02] p-5">
            <span className="text-xs text-white/40">Key message</span>
            <p className="mt-1.5 font-sans text-lg font-semibold italic text-white">
              &ldquo;The whole brand, one studio.&rdquo;
            </p>
          </div>
        </div>
      </BrandModule>

      <BrandModule label="Templates & collateral" desc="Social, presentation and ad templates, ready to run.">
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATE_MOCKS.map((src) => (
            <div key={src} className="aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </BrandModule>

      <div className="flex animate-[tier-rise_500ms_ease-out_both] items-center gap-4 rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/10">
        <DeliverableIcon icon="book" className="h-6 w-6 shrink-0 text-orange" />
        <div>
          <span className="block text-sm font-semibold text-white">Brand guidelines book</span>
          <span className="block text-xs leading-relaxed text-white/45">
            Usage, spacing, do&rsquo;s &amp; don&rsquo;ts and co-branding — the whole system, documented.
          </span>
        </div>
      </div>
    </div>
  );
}

function ChecklistGrid({ items }: { items: string[] }) {
  return (
    <ModuleShell label="End to end" title="We handle everything for your event.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item}
            className="sd-reveal flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
          >
            <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
            <span className="font-sans font-semibold uppercase tracking-tight text-white">{item}</span>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}

function FocusBento({ items }: { items: string[] }) {
  return (
    <ModuleShell label="Where we focus" title="Full-funnel, online and off.">
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item}
            className="sd-reveal group/fb flex items-center gap-6 border-t border-white/10 py-6 last:border-b md:gap-12 md:py-7"
          >
            <span
              className="font-sans font-black leading-none text-white/[0.09] transition-colors duration-500 group-hover/fb:text-orange/30"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
            >
              {num(i)}
            </span>
            <h3
              className="font-sans font-bold uppercase tracking-tight text-white transition-all duration-300 group-hover/fb:translate-x-2 group-hover/fb:text-orange"
              style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2.5rem)' }}
            >
              {item}
            </h3>
            <span
              aria-hidden
              className="ml-auto -translate-x-3 text-3xl text-orange opacity-0 transition-all duration-300 group-hover/fb:translate-x-0 group-hover/fb:opacity-100"
            >
              &rarr;
            </span>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}

function ProcessSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ModuleShell label="How we work" title="From first sketch to launch.">
      <div className="relative">
        {/* Connecting rail — the process runs top→down on mobile, left→right on desktop. It
            passes behind the charcoal number nodes so the steps read as beads on a string. */}
        <div
          aria-hidden
          className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-orange/50 via-white/15 to-white/[0.06] md:inset-x-0 md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
        />
        <ol className="grid gap-y-10 md:grid-cols-5 md:gap-x-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="sd-reveal group/ps relative flex items-start gap-5 md:flex-col md:gap-0"
            >
              <span className="relative z-content flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-charcoal text-base font-bold tabular-nums text-orange transition-all duration-300 group-hover/ps:-translate-y-1 group-hover/ps:border-orange group-hover/ps:bg-orange group-hover/ps:text-navy group-hover/ps:shadow-[0_12px_30px_-8px_rgba(245,139,39,0.55)]">
                {num(i)}
              </span>
              <div className="md:mt-7">
                <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-white transition-colors duration-300 group-hover/ps:text-orange lg:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </ModuleShell>
  );
}

function DisciplineSplit({ disciplines }: { disciplines: { label: string; items: string[] }[] }) {
  return (
    <ModuleShell label="Two disciplines" title="Every frame, every format.">
      <div className="flex flex-col gap-14">
        {disciplines.map((d, di) => {
          const isVideo = d.label.toLowerCase().includes('video');
          return (
            <div key={d.label} className="sd-reveal">
              <h3 className="mb-6 flex flex-wrap items-center gap-3 font-sans text-2xl font-bold uppercase tracking-tight text-orange">
                <span className="text-sm font-bold tabular-nums text-orange/60">{num(di)}</span>
                {d.label}
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-white/35 hover-fine:inline">
                  {isVideo ? '— hover to play' : '— hover to focus'}
                </span>
              </h3>
              <div
                className={cn(
                  'grid gap-4',
                  isVideo ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3',
                )}
              >
                {d.items.map((item, i) => {
                  const src = DISCIPLINE_IMAGES[(di * 3 + i) % DISCIPLINE_IMAGES.length];
                  return isVideo ? (
                    <VideoTile key={item} src={src} label={item} />
                  ) : (
                    <PhotoTile key={item} src={src} label={item} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ModuleShell>
  );
}

// Photography tile — selective (rack) focus. Every frame rests OUT of focus (blurred,
// desaturated) on hover-capable devices; hovering a card racks that one — and only that one —
// into sharp focus with a reticle hunt and a shutter flash. Touch / reduced-motion sees it sharp.
function PhotoTile({ src, label }: { src: string; label: string }) {
  return (
    <div className="group/pt pf-tile relative aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10 transition-all duration-300 hover-fine:hover:ring-orange/60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="pf-focus-img h-full w-full object-cover will-change-[filter,transform]"
      />
      {/* Shutter flash — fires at the focus-lock moment (delayed to the end of the hunt). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white opacity-0 group-hover/pt:motion-safe:animate-[camera-flash_520ms_ease-out_430ms]"
      />
      {/* Autofocus reticle — hunts, then locks just before the frame sharpens. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 scale-[1.6] rounded-full border border-orange/0 opacity-0 transition-all duration-[430ms] ease-out group-hover/pt:scale-100 group-hover/pt:border-orange/80 group-hover/pt:opacity-100" />
      {/* Viewfinder corner brackets on hover. */}
      <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-white/80 opacity-0 transition-all duration-300 group-hover/pt:left-3 group-hover/pt:top-3 group-hover/pt:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-white/80 opacity-0 transition-all duration-300 group-hover/pt:right-3 group-hover/pt:top-3 group-hover/pt:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/80 opacity-0 transition-all duration-300 group-hover/pt:bottom-3 group-hover/pt:left-3 group-hover/pt:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/80 opacity-0 transition-all duration-300 group-hover/pt:bottom-3 group-hover/pt:right-3 group-hover/pt:opacity-100" />
      {/* Bottom scrim + label. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-charcoal via-charcoal/55 to-transparent" />
      <span className="absolute inset-x-4 bottom-4 z-10 font-sans text-base font-bold uppercase leading-tight tracking-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)] md:text-lg">
        {label}
      </span>
    </div>
  );
}

// Videography tile — a cinematic playback frame: 16:9, letterbox bars slide in, a scanline
// sweeps, a REC dot + timecode arm, a play button reveals, and a timeline scrubs across.
function VideoTile({ src, label }: { src: string; label: string }) {
  return (
    <div className="group/vt relative aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-white/10 transition-all duration-300 hover-fine:hover:ring-orange/60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover brightness-95 grayscale-[0.35] transition-all duration-500 ease-out group-hover/vt:scale-105 group-hover/vt:brightness-100 group-hover/vt:grayscale-0"
      />
      {/* Cinematic letterbox bars. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0 bg-black/85 transition-[height] duration-300 ease-out group-hover/vt:h-[9%]" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-black/85 transition-[height] duration-300 ease-out group-hover/vt:h-[9%]" />
      {/* Scanline sweep. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover/vt:opacity-100 group-hover/vt:motion-safe:animate-[video-scan_2.6s_linear_infinite]"
      />
      {/* REC + timecode. */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover/vt:opacity-100">
        <span className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
        REC
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 font-mono text-[10px] tabular-nums text-white/75 opacity-0 transition-opacity duration-300 group-hover/vt:opacity-100">
        00:00:24
      </span>
      {/* Play button — faint on touch (no hover), full on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full border border-white/40 bg-black/25 opacity-0 backdrop-blur-sm transition-all duration-300 touch-coarse:opacity-90 group-hover/vt:scale-100 group-hover/vt:border-orange group-hover/vt:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5 text-white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      {/* Scrubbing timeline. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[3px] bg-white/25">
        <span className="block h-full w-0 bg-orange transition-[width] duration-[2600ms] ease-linear group-hover/vt:w-full" />
      </span>
      {/* Label. */}
      <span className="absolute inset-x-4 bottom-4 z-10 font-sans text-base font-bold uppercase leading-tight tracking-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)] md:text-lg">
        {label}
      </span>
    </div>
  );
}

function InfluenceList({ items }: { items: string[] }) {
  return (
    <ModuleShell label="Who we connect you with" title="The right people, the right reach.">
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={item}
            className="sd-reveal group/inf flex items-center gap-6 border-b border-white/10 py-6 transition-colors duration-300 hover-fine:hover:border-orange/50"
          >
            <span className="text-sm font-bold tabular-nums text-orange transition-transform duration-300 group-hover/inf:scale-125">
              {num(i)}
            </span>
            <span
              className="flex-1 font-sans font-bold uppercase tracking-tight text-white transition-all duration-300 group-hover/inf:translate-x-2 group-hover/inf:text-orange"
              style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.75rem)' }}
            >
              {item}
            </span>
            <span
              aria-hidden
              className="-translate-x-3 text-2xl text-orange opacity-0 transition-all duration-300 group-hover/inf:translate-x-0 group-hover/inf:opacity-100"
            >
              &rarr;
            </span>
          </li>
        ))}
      </ul>
    </ModuleShell>
  );
}

function DpiBand() {
  const words = ['Design', 'Print', 'Install'];
  return (
    <ModuleShell label="Concept to execution">
      <div className="sd-reveal flex flex-wrap items-center gap-x-6 gap-y-2">
        {words.map((w, i) => (
          <span key={w} className="flex items-center gap-6">
            <span
              className="font-sans font-black uppercase leading-none tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}
            >
              {w}
            </span>
            {i < words.length - 1 && (
              <span className="text-orange" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
                &middot;
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="sd-reveal mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
        High-quality materials, produced and installed by an experienced team &mdash; from a
        single business card to a full vehicle wrap.
      </p>
    </ModuleShell>
  );
}
