'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ServiceRecord } from '@/types/content';
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
          <SectionLabel className="sd-reveal mb-6">Services</SectionLabel>
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

        {/* Scroll cue. */}
        <span
          aria-hidden
          className="sd-reveal absolute bottom-10 left-1/2 z-content flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-orange text-orange motion-safe:animate-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </section>

      {/* ── SCOPE ────────────────────────────────────────────────────────── */}
      {service.scopeItems.length > 0 && (
        <section className="relative overflow-hidden px-gutter-m py-16 lg:px-gutter-d lg:py-20">
          <div aria-hidden className="pattern-section-fade absolute inset-0">
            <BrandPattern variant="tiled" />
          </div>
          <div className="relative z-content mx-auto max-w-6xl">
            <SectionLabel className="sd-reveal mb-10">What&apos;s included</SectionLabel>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {service.scopeItems.map((item, i) => (
                <div
                  key={item}
                  className="sd-reveal flex items-baseline gap-5 border-b border-white/10 py-5"
                >
                  <span className="font-sans text-sm font-bold tabular-nums text-orange">{num(i)}</span>
                  <span className="font-sans text-lg font-semibold uppercase tracking-tight text-white md:text-xl">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SIGNATURE MODULE (adapts per service) ────────────────────────── */}
      <SignatureModule service={service} />

      {/* ── SELECTED WORK (SMV-style image grid) ─────────────────────────── */}
      <ServiceWorkGrid />

      {/* ── PROOF + RELATED WORK ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 px-gutter-m py-16 lg:px-gutter-d lg:py-20">
        <div aria-hidden className="pattern-section-fade absolute inset-0">
          <BrandPattern variant="tiled" />
        </div>
        <div className="relative z-content mx-auto max-w-6xl">
          <SectionLabel className="sd-reveal mb-8">Trusted by</SectionLabel>
          <div className="sd-reveal flex flex-wrap items-center gap-4">
            {PROOF_LOGOS.map((logo) => (
              <span
                key={logo.name}
                className="flex h-20 w-40 items-center justify-center rounded-xl bg-white/90 px-6 py-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
              </span>
            ))}
          </div>

          <div className="mt-14">
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
    <section className="relative overflow-hidden border-t border-white/10 px-gutter-m py-16 lg:px-gutter-d lg:py-20">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">{label}</SectionLabel>
        {title && (
          <h2
            className="sd-reveal mb-12 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
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
      <p className="sd-reveal mt-6 text-xs uppercase tracking-wider text-white/40">
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
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item}
            className="sd-reveal flex min-h-[9rem] flex-col justify-between rounded-2xl border border-white/12 bg-white/[0.02] p-8 transition-hover hover-fine:hover:border-orange/50"
          >
            <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-white md:text-2xl">
              {item}
            </h3>
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
      <div className="grid gap-6 md:grid-cols-2">
        {disciplines.map((d) => (
          <div
            key={d.label}
            className="sd-reveal rounded-2xl border border-white/12 bg-white/[0.02] p-8 lg:p-10"
          >
            <h3 className="mb-6 font-sans text-2xl font-bold uppercase tracking-tight text-orange">
              {d.label}
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {d.items.map((item) => (
                <li key={item} className="font-sans font-semibold uppercase tracking-tight text-white/80">
                  {item}
                </li>
              ))}
            </ul>
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
          <li key={item} className="sd-reveal flex items-center gap-6 border-b border-white/10 py-6">
            <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
            <span
              className="font-sans font-bold uppercase tracking-tight text-white"
              style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.75rem)' }}
            >
              {item}
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
