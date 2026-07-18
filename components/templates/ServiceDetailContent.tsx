'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ServiceRecord, ServiceSlug } from '@/types/content';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { ServicesCTA } from '@/components/sections/services/ServicesCTA';
import { ServiceNextPrev } from '@/components/sections/services/ServiceNextPrev';
import { ServiceWorkGrid } from '@/components/sections/services/ServiceWorkGrid';
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

        {/* Back to the index (SMV back arrow). */}
        <Link
          href="/services"
          aria-label="Back to services"
          className="group absolute left-gutter-m top-24 z-content flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-hover hover-fine:hover:border-orange hover-fine:hover:text-orange lg:left-gutter-d"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="relative z-content flex max-w-4xl flex-col items-center">
          <nav
            aria-label="Breadcrumb"
            className="sd-reveal mb-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60"
          >
            <Link href="/services" className="transition-hover hover-fine:hover:text-orange">
              Services
            </Link>
            <span aria-hidden className="text-orange">&rarr;</span>
            <span className="text-white">{service.title}</span>
          </nav>
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

      {/* ── SCOPE (layout unique per service type) ───────────────────────── */}
      <ServiceScope service={service} />

      {/* ── SIGNATURE MODULE (adapts per service) ────────────────────────── */}
      <SignatureModule service={service} />

      {/* ── SELECTED WORK (SMV-style image grid) ─────────────────────────── */}
      <ServiceWorkGrid />

      {/* ── PROOF + RELATED WORK ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 px-gutter-m py-12 lg:px-gutter-d lg:py-16">
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

          <div className="mt-10">
            <SectionLabel className="sd-reveal mb-6">Related work</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedThree.map((rw, i) => (
                <Link
                  key={`${rw.href}-${i}`}
                  href={rw.href}
                  className="group/rw sd-reveal flex items-center justify-between gap-4 rounded-xl border border-white/12 bg-white/[0.02] p-6 transition-hover hover-fine:hover:border-orange/50 hover-fine:hover:bg-white/[0.04]"
                >
                  <span className="font-sans text-base font-bold uppercase tracking-tight text-white">
                    {rw.label}
                  </span>
                  <span
                    aria-hidden
                    className="text-orange transition-transform duration-300 group-hover/rw:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEXT / PREV (SMV project-detail signature) ───────────────────── */}
      <ServiceNextPrev slug={service.slug} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <ServicesCTA heading={cfg.ctaHeading} tertiary={service.tertiaryCta} />
    </div>
  );
}

/* ───────────────────────── Scope ("What's included") ───────────────────────── */

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

// Systematic multi-column index (marketing-adjacent digital services).
function ScopeGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-x-14 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item}
          className="sd-reveal group/sc flex items-baseline gap-4 border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:border-orange/50"
        >
          <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
          <span className="font-sans text-base font-semibold uppercase tracking-tight text-white transition-colors duration-300 group-hover/sc:text-orange md:text-lg">
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

function SignatureModule({ service }: { service: ServiceRecord }) {
  const cfg = serviceDetailConfig[service.slug];

  if (service.slug === 'graphics-production') return <DpiBand />;
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
    <section className="relative overflow-hidden border-t border-white/10 px-gutter-m py-12 lg:px-gutter-d lg:py-16">
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

function TierCards({ service }: { service: ServiceRecord }) {
  const tiers = service.tiers ?? [];
  // Interactive: click a tier to reveal what's included; the other collapses.
  const [active, setActive] = useState(tiers.length - 1);

  return (
    <ModuleShell label="How we package it" title="Choose your level of brand.">
      <div className="grid items-start gap-6 md:grid-cols-2">
        {tiers.map((tier, i) => {
          const isActive = active === i;
          return (
            <button
              key={tier.name}
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={isActive}
              className={cn(
                'sd-reveal block rounded-2xl border p-8 text-left transition-all duration-300 lg:p-10',
                isActive
                  ? 'border-orange bg-orange/[0.08]'
                  : 'border-white/12 bg-white/[0.02] hover-fine:hover:border-white/30',
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
                  <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-white md:text-2xl">
                    {tier.name}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all duration-300',
                    isActive ? 'rotate-45 border-orange text-orange' : 'border-white/25 text-white/60',
                  )}
                >
                  +
                </span>
              </div>
              <div
                className={cn(
                  'grid transition-all duration-500 ease-out',
                  isActive ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <ul className="flex flex-col gap-3 overflow-hidden">
                  {tier.items.map((item) => (
                    <li key={item} className="flex gap-3 text-white/75">
                      <span aria-hidden className="mt-1 text-orange">
                        &mdash;
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
      <p className="sd-reveal mt-4 text-xs uppercase tracking-wider text-white/40">
        Tap a tier to see what&apos;s included.
      </p>
    </ModuleShell>
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
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.title} className="sd-reveal flex flex-col gap-3 bg-charcoal p-6 lg:p-7">
            <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
            <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-white/65">{step.body}</p>
          </li>
        ))}
      </ol>
    </ModuleShell>
  );
}

function DisciplineSplit({ disciplines }: { disciplines: { label: string; items: string[] }[] }) {
  return (
    <ModuleShell label="Two disciplines" title="Every frame, every format.">
      <div className="flex flex-col gap-12">
        {disciplines.map((d, di) => (
          <div key={d.label} className="sd-reveal">
            <h3 className="mb-5 flex items-center gap-3 font-sans text-2xl font-bold uppercase tracking-tight text-orange">
              <span className="text-sm font-bold tabular-nums text-orange/60">{num(di)}</span>
              {d.label}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {d.items.map((item, i) => (
                <div
                  key={item}
                  className="group/dt relative aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DISCIPLINE_IMAGES[(di * 3 + i) % DISCIPLINE_IMAGES.length]}
                    alt=""
                    className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover/dt:scale-105 group-hover/dt:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/60 transition-colors duration-300 group-hover/dt:from-charcoal/90 group-hover/dt:via-charcoal/20 group-hover/dt:to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 font-sans text-sm font-bold uppercase leading-tight tracking-tight text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModuleShell>
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
