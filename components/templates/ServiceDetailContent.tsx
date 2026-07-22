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
import { MarketingFunnel } from '@/components/sections/services/MarketingFunnel';
import { PhotoVideoHeroTitle } from '@/components/sections/services/PhotoVideoHeroTitle';
import { PhotoVideoHeroOverview } from '@/components/sections/services/PhotoVideoHeroOverview';
import { WebsitesShowcase } from '@/components/sections/services/WebsitesShowcase';
import { MobileAppShowcase } from '@/components/sections/services/MobileAppShowcase';
import { EventsJourney } from '@/components/sections/services/EventsJourney';
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
type ScopeVariant =
  | 'editorial'
  | 'grid'
  | 'ledger'
  | 'channels'
  | 'stack'
  | 'techspec'
  | 'coverage';
const SCOPE_VARIANT: Record<ServiceSlug, ScopeVariant> = {
  'branding-visual-identity': 'editorial',
  'public-relations': 'grid',
  'online-offline-marketing': 'channels',
  websites: 'stack',
  'mobile-applications': 'techspec',
  events: 'coverage',
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
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-charcoal px-gutter-m pb-20 pt-28 text-center lg:px-gutter-d lg:pb-28">
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
          className="sd-reveal absolute left-1/2 top-24 z-content flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-wider text-white/60"
        >
          <Link href="/services" className="transition-hover hover-fine:hover:text-orange">
            Services
          </Link>
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3 w-3 shrink-0 text-orange">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white">{service.title}</span>
        </nav>

        <div className="relative z-content flex max-w-4xl translate-y-6 flex-col items-center md:translate-y-10">
          {service.slug === 'photography-videography' ? (
            <PhotoVideoHeroTitle className="sd-reveal" />
          ) : (
            <h1
              className="sd-reveal font-sans font-bold uppercase leading-[0.9] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
              style={{ fontSize: 'clamp(2.4rem, 8.5vw, 7rem)' }}
            >
              {service.h1}
              <span className="text-orange">.</span>
            </h1>
          )}
          {service.slug === 'photography-videography' ? (
            <PhotoVideoHeroOverview />
          ) : (
            <p className="sd-reveal mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/80 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] md:text-lg">
              {service.overview}
            </p>
          )}
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
      <div
        className={cn(
          'relative z-content mx-auto max-w-6xl',
          variant === 'techspec' && 'max-w-[88rem]',
        )}
      >
        <SectionLabel className="sd-reveal mb-8">What&apos;s included</SectionLabel>
        {variant === 'editorial' && <ScopeEditorial items={service.scopeItems} />}
        {variant === 'grid' && <ScopeGrid items={service.scopeItems} />}
        {variant === 'ledger' && <ScopeLedger items={service.scopeItems} />}
        {variant === 'channels' && <ScopeChannels items={service.scopeItems} />}
        {variant === 'stack' && <ScopeStack items={service.scopeItems} />}
        {variant === 'techspec' && <ScopeTechSpec items={service.scopeItems} />}
        {variant === 'coverage' && <ScopeCoverage items={service.scopeItems} />}
      </div>
    </section>
  );
}

// Photography "What's included" — big ghost numbers + heavy rows, each grounded with a one-line
// descriptor of what we actually shoot. Natural-case names (no CSS uppercase) plus the oversized
// faint numeral are the signature — distinct from the chip grid, ledger arrows, marketing
// descriptors, web layers, mono tech-spec, and event checklist used by the other services. Flat
// divided rows on the section background, no cards.
const PHOTO_SCOPE_DESC: Record<string, string> = {
  'Product photography': 'Clean, considered shots that make products sell.',
  'Lifestyle & editorial': 'Brand stories told through people, mood, and place.',
  'Event coverage': 'The whole day captured — candids, details, and key moments.',
  'Real estate': 'Interiors and spaces shot to feel bright and inviting.',
  'Cinematic video': 'Brand films, product reels, and testimonials, shot and cut.',
  'Motion graphics': 'Animated logos, explainers, and titles that move.',
  'Live streaming': 'Multi-camera streams for events, launches, and broadcasts.',
};

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
          <div className="min-w-0">
            <span
              className="block font-sans font-bold tracking-tight text-white transition-all duration-300 group-hover/sc:translate-x-2 group-hover/sc:text-orange"
              style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.9rem)' }}
            >
              {item}
            </span>
            {PHOTO_SCOPE_DESC[item] && (
              <span className="mt-1 block text-sm leading-relaxed text-white/50">
                {PHOTO_SCOPE_DESC[item]}
              </span>
            )}
          </div>
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

// One-line descriptor per marketing discipline — subject-grounded content so the scope reads as
// a capability index, not a bare list.
const MARKETING_SCOPE_DESC: Record<string, string> = {
  'Brand strategy': 'The positioning and message every channel is built on.',
  'Digital marketing campaigns': 'Multi-channel campaigns, planned, run, and optimised.',
  'Video content': 'Scroll-stopping video for social, ads, and screens.',
  'Social media management': 'Day-to-day content, community, and steady growth.',
  'Content marketing': 'Articles, guides, and assets that earn attention.',
  'Influencer marketing': 'The right creators, matched to your audience.',
  'Digital ads': 'Paid search, social, and display that convert.',
  'Print & production': 'Signage, large-format, and branded collateral — produced and installed.',
};

// Marketing "What's included" — an editorial capability index. The lead discipline is featured
// full-width as the section's one bold anchor; the rest fall into a quiet two-column index, each
// with a one-line descriptor. Natural-case names + descriptors set it apart from the ledger (spec
// sheet), the grid (chip nodes) and the editorial (ghost numbers) used by the other services.
function ScopeChannels({ items }: { items: string[] }) {
  return (
    <div className="grid gap-x-12 border-t border-white/15 sm:grid-cols-2">
      {items.map((item, i) => {
        const featured = i === 0;
        return (
          <div
            key={item}
            className={cn(
              'sd-reveal group/sc border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:border-orange/40',
              featured && 'sm:col-span-2',
            )}
          >
            <div className="flex items-baseline gap-4">
              <span className="text-sm font-bold tabular-nums text-orange">{num(i)}</span>
              <div>
                <span
                  className={cn(
                    'block font-sans font-bold tracking-tight text-white transition-all duration-300 group-hover/sc:translate-x-1 group-hover/sc:text-orange',
                    featured ? 'text-2xl md:text-3xl' : 'text-lg',
                  )}
                >
                  {item}
                </span>
                <span
                  className={cn(
                    'mt-1 block leading-relaxed text-white/50',
                    featured ? 'max-w-xl text-base' : 'text-sm',
                  )}
                >
                  {MARKETING_SCOPE_DESC[item]}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// One-line web descriptor per website deliverable — grounds the stack in real subject matter.
const WEB_SCOPE_DESC: Record<string, string> = {
  'Website design & development': 'Custom sites, designed and built from the ground up.',
  'Landing pages': 'Focused, high-converting pages for every campaign.',
  'UX/UI': 'Interfaces that are intuitive to navigate and quick to grasp.',
  'Performance optimization': 'Fast loads, clean code, and healthy Core Web Vitals.',
  'Ongoing management': 'Hosting, updates, security, and steady improvement.',
};

// A small wireframe glyph per build layer — signals a website being assembled (page skeleton,
// landing hero, UI blocks, a speed gauge, a maintenance loop) rather than a number or chip. Stroke
// + currentColor so each glyph inherits its layer's accent tone.
function LayerMotif({ kind, className }: { kind: string; className?: string }) {
  const s = {
    viewBox: '0 0 32 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };
  switch (kind) {
    // Design & development — a full page skeleton (header, content column + sidebar).
    case 'build':
      return (
        <svg {...s}>
          <rect x="3" y="3.5" width="26" height="17" rx="1.5" />
          <path d="M3 8.5h26" />
          <path d="M6.5 12h9M6.5 15h9M6.5 18h6" />
          <rect x="18.5" y="11.5" width="7.5" height="7" rx="1" />
        </svg>
      );
    // Landing pages — a single focused hero with one call-to-action.
    case 'landing':
      return (
        <svg {...s}>
          <rect x="3" y="3.5" width="26" height="17" rx="1.5" />
          <path d="M9 8.5h14M11 12h10" />
          <rect x="12" y="15" width="8" height="3.4" rx="1.2" />
        </svg>
      );
    // UX/UI — component blocks with a cursor.
    case 'uxui':
      return (
        <svg {...s}>
          <rect x="3" y="4" width="10" height="7" rx="1.2" />
          <rect x="3" y="13.5" width="10" height="6.5" rx="1.2" />
          <path d="M18 5.5l7 5.5-3 .7 1.9 3.4-1.9 1.1-1.9-3.4-2.2 2.2V5.5Z" />
        </svg>
      );
    // Performance — a speed gauge with its needle.
    case 'perf':
      return (
        <svg {...s}>
          <path d="M4 19a12 12 0 0 1 24 0" />
          <path d="M16 19l6.5-5" />
          <circle cx="16" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    // Ongoing management — a refresh / update loop.
    case 'care':
      return (
        <svg {...s}>
          <path d="M25 12a9 9 0 0 0-15.5-6.2M7.5 4v4h4" />
          <path d="M7 12a9 9 0 0 0 15.5 6.2M24.5 20v-4h-4" />
        </svg>
      );
    default:
      return null;
  }
}

// Each website deliverable maps to a build layer, in stack order (foundation → care).
const WEB_LAYER_KIND: Record<string, string> = {
  'Website design & development': 'build',
  'Landing pages': 'landing',
  'UX/UI': 'uxui',
  'Performance optimization': 'perf',
  'Ongoing management': 'care',
};

// Websites "What's included" — an exploded 3D layer stack. The deliverables are flat planes stacked
// in perspective (perspective + rotateX + per-plane translateZ), each with only a hairline top edge
// and a wireframe glyph of that layer — so the section reads as the site itself being built up in
// z-layers, not as a list of cards. Hovering or focusing a plane lifts it out of the stack toward
// the viewer, lights its leading edge orange, and brings its descriptor forward. Flat planes on the
// bare background — no borders, chips or numbers — distinct from every other scope variant and from
// the browser-mock signature module below. Reduced motion renders the same planes flat and static.
function ScopeStack({ items }: { items: string[] }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  return (
    <div className="sd-reveal [perspective-origin:50%_28%] [perspective:1500px]">
      <div
        className="mx-auto flex max-w-3xl flex-col gap-2.5 [transform-style:preserve-3d]"
        style={reducedMotion ? undefined : { transform: 'rotateX(18deg)' }}
      >
        {items.map((item, i) => {
          const on = active === i;
          return (
            <button
              key={item}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                'group/ly relative flex w-full items-center gap-5 border-t py-5 pl-6 pr-5 text-left md:gap-7 md:pl-8',
                on ? 'border-orange/70' : 'border-white/12',
              )}
              style={
                reducedMotion
                  ? undefined
                  : {
                      transform: `translateZ(${i * 8 + (on ? 44 : 0)}px) translateY(${on ? -4 : 0}px)`,
                      boxShadow: on ? '0 26px 55px -30px rgba(245,139,39,0.65)' : 'none',
                      transition:
                        'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.3s ease',
                    }
              }
            >
              {/* Faint plane sheen (static) + the orange wash that fades in when the layer is live. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.045] to-transparent"
              />
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 bg-gradient-to-r from-orange/[0.1] via-orange/[0.03] to-transparent transition-opacity duration-300',
                  on ? 'opacity-100' : 'opacity-0',
                )}
              />
              {/* Leading edge — an orange spine that grows as the layer lifts. */}
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-0 h-full w-[3px] origin-top bg-orange transition-transform duration-300 ease-out',
                  on ? 'scale-y-100' : 'scale-y-0',
                )}
              />
              <span
                className={cn(
                  'relative shrink-0 transition-colors duration-300',
                  on ? 'text-orange' : 'text-white/35',
                )}
              >
                <LayerMotif kind={WEB_LAYER_KIND[item]} className="h-7 w-9" />
              </span>
              <span className="relative min-w-0 flex-1">
                <span
                  className={cn(
                    'block font-sans font-bold tracking-tight transition-colors duration-300',
                    on ? 'text-white' : 'text-white/75',
                  )}
                  style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)' }}
                >
                  {item}
                </span>
                {WEB_SCOPE_DESC[item] && (
                  <span
                    className={cn(
                      'mt-1 block text-sm leading-relaxed transition-colors duration-300',
                      on ? 'text-white/60' : 'text-white/35',
                    )}
                  >
                    {WEB_SCOPE_DESC[item]}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Mobile "What's included" — a build spec keyed like an engineering manifest. Each capability sits
// against a fixed "code gutter" column that now shows the actual tools visually: small authored
// tech glyphs (Swift, Kotlin, React, Figma, GraphQL, the two stores…) above a monospace stack tag,
// then a one-line descriptor. The tool-icon gutter is the distinguishing signature — no numbers, no
// chips, no card — and it reads as the tech stack behind the app, unlike every other scope variant
// (editorial ghost numbers, grid chips, ledger arrows, marketing descriptors, print proof sheet,
// web layers). Glyphs are simple geometric marks we author — not fetched brand logos.
const APP_SCOPE_TAG: Record<string, string> = {
  'iOS & Android apps': 'Swift · Kotlin',
  'Cross-platform development': 'React Native',
  'Mobile UX/UI design': 'Figma',
  'API & backend integration': 'REST · GraphQL',
  'App Store & Play Store launch': 'App Store · Play',
  'Maintenance & updates': 'Care plan',
};
// The tech glyphs shown in the gutter for each capability, keyed to TechGlyph below.
const APP_SCOPE_TECH: Record<string, string[]> = {
  'iOS & Android apps': ['swift', 'kotlin'],
  'Cross-platform development': ['react'],
  'Mobile UX/UI design': ['figma'],
  'API & backend integration': ['graphql'],
  'App Store & Play Store launch': ['appstore', 'playstore'],
  'Maintenance & updates': ['refresh'],
};
const APP_SCOPE_DESC: Record<string, string> = {
  'iOS & Android apps': 'Native builds that feel at home on each platform.',
  'Cross-platform development': 'One codebase, both stores — shipped faster.',
  'Mobile UX/UI design': 'Flows and interfaces designed for thumbs, not cursors.',
  'API & backend integration': 'Apps wired to secure back-ends and live data.',
  'App Store & Play Store launch': 'Submission, review, and release, handled end to end.',
  'Maintenance & updates': 'New OS versions, fixes, and features after launch.',
};

// Authored, geometric tech marks (not brand logos) — a visual shorthand for the stack behind each
// capability. Stroke + currentColor so they inherit the orange gutter tone.
function TechGlyph({ kind, className }: { kind: string; className?: string }) {
  const s = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };
  switch (kind) {
    // Swift — a swift's swooping tail feather (a simple filled swoosh).
    case 'swift':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
          <path d="M5 4c5 1.4 9 4.3 11.6 8.3.7-1.7.6-3.8-.3-6 2.6 2.6 3.9 6.4 3.2 9.9.9 1.4 1.2 2.9.9 4.2-1-1.6-2.6-2.1-4.2-1.8-2.9 1.3-6.9.9-10.4-1.8 2.6.5 5.2.1 7-1C9.6 12.6 6.6 8.9 5 4Z" />
        </svg>
      );
    // Kotlin — the folded square (two triangles meeting at the left edge).
    case 'kotlin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden className={className}>
          <path d="M4 4h16L12 12l8 8H4V4Z" />
          <path d="M4 4l8 8-8 8" />
        </svg>
      );
    // React — the electron-orbit atom (nucleus + three orbits).
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className={className}>
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      );
    // Figma — the stacked-node mark (three left discs + two right).
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className={className}>
          <path d="M12 3H8.5a2.75 2.75 0 0 0 0 5.5H12V3Z" />
          <path d="M12 3h3.5a2.75 2.75 0 0 1 0 5.5H12V3Z" />
          <path d="M12 8.5H8.5a2.75 2.75 0 0 0 0 5.5H12V8.5Z" />
          <circle cx="15.25" cy="11.25" r="2.75" />
          <path d="M12 14H9.75a2.75 2.75 0 1 0 2.25 4.33V14Z" />
        </svg>
      );
    // GraphQL — the connected hexagon of nodes.
    case 'graphql':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className={className}>
          <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />
          <path d="M4.5 7.5 12 20.5M19.5 7.5 12 20.5M4.5 7.5h15" />
          <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19.8" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19.8" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="21" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4.2" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4.2" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    // App Store — a rounded tile with the stylised "A".
    case 'appstore':
      return (
        <svg {...s}>
          <rect x="3" y="3" width="18" height="18" rx="4.5" />
          <path d="M8.5 16 12 8.5 15.5 16M9.7 13.4h4.6" />
        </svg>
      );
    // Play Store — the play triangle with its split seam.
    case 'playstore':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden className={className}>
          <path d="M5 3.5 19 12 5 20.5V3.5Z" />
          <path d="m5 3.5 9.2 9.2M5 20.5l9.2-8" />
        </svg>
      );
    // Maintenance — the update / refresh cycle.
    case 'refresh':
      return (
        <svg {...s}>
          <path d="M20 8a8 8 0 0 0-14.3-2M4 5v4h4" />
          <path d="M4 16a8 8 0 0 0 14.3 2M20 19v-4h-4" />
        </svg>
      );
    default:
      return null;
  }
}

function ScopeTechSpec({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, Math.max(0, items.length - 1));
  const item = items[safeIndex] ?? '';
  const tags = APP_SCOPE_TECH[item] ?? [];

  return (
    <div className="sd-reveal overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.03] to-transparent lg:grid lg:grid-cols-[minmax(13rem,0.34fr)_1fr]">
      <div
        className="flex gap-2 overflow-x-auto border-b border-white/10 p-2 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Capabilities"
      >
        {items.map((label, i) => {
          const on = i === safeIndex;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={on}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                'min-w-[10.5rem] shrink-0 rounded-xl px-4 py-3 text-left transition-all duration-300 lg:min-w-0 lg:rounded-none lg:border-b lg:border-white/8 lg:px-5 lg:py-4 lg:last:border-b-0',
                on
                  ? 'bg-orange text-navy shadow-[inset_3px_0_0_0_#0f151f] lg:bg-orange/[0.12] lg:text-white lg:shadow-[inset_3px_0_0_0_#f58b27]'
                  : 'bg-white/[0.03] text-white/50 hover-fine:hover:bg-white/[0.06] lg:bg-transparent lg:hover-fine:hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'font-mono text-[0.65rem] font-semibold tabular-nums',
                  on ? 'text-navy/65 lg:text-orange' : 'text-orange/75',
                )}
              >
                {num(i)}
              </span>
              <span className="mt-1 block font-sans text-sm font-bold leading-snug lg:text-[0.95rem]">{label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="relative flex min-h-[17rem] flex-col justify-end overflow-hidden p-6 sm:min-h-[19rem] sm:p-8 lg:min-h-[26rem] lg:p-10 xl:p-12"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 top-2 font-sans font-black leading-none text-white/[0.045] select-none"
          style={{ fontSize: 'clamp(4.5rem, 16vw, 10rem)' }}
        >
          {num(safeIndex)}
        </span>
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
          {tags.map((k) => (
            <span
              key={k}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange/35 bg-orange/10 text-orange sm:h-11 sm:w-11"
            >
              <TechGlyph kind={k} className="h-5 w-5" />
            </span>
          ))}
          {APP_SCOPE_TAG[item] && (
            <span className="rounded-full border border-white/10 bg-charcoal/60 px-3 py-1 font-mono text-[0.68rem] text-white/45">
              {APP_SCOPE_TAG[item]}
            </span>
          )}
        </div>
        <h3
          key={item}
          className="relative z-10 mt-5 max-w-2xl font-sans font-bold tracking-tight text-white motion-safe:animate-[tier-rise_360ms_ease-out_both] lg:mt-6"
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.65rem)' }}
        >
          {item}
        </h3>
        <p
          key={`${item}-d`}
          className="relative z-10 mt-3 max-w-2xl text-base leading-relaxed text-white/60 motion-safe:animate-[tier-rise_360ms_ease-out_both] lg:max-w-3xl lg:text-lg"
        >
          {APP_SCOPE_DESC[item] ?? ''}
        </p>
      </div>
    </div>
  );
}

// One-line descriptor per event deliverable — grounds the coverage list in the real work.
const EVENT_SCOPE_DESC: Record<string, string> = {
  'Event branding & identity': 'A name, look, and key visual made for the event alone.',
  'Marketing materials': 'Invites, signage, stage, and print — designed and produced.',
  'Full organisation & logistics': 'Venue, vendors, timings, and the run-of-show on the day.',
  'Photography & videography': 'Every moment captured, edited, and delivered.',
  'Social media coverage': 'Teasers, countdowns, and live posting throughout.',
  'Post-event evaluation': 'An honest read on the results against the goals we set.',
};

// Each deliverable maps to where it lands in the event's run-of-show, so the checklist reads as a
// schedule from planning through to the wrap-up.
const EVENT_SCOPE_PHASE: Record<string, string> = {
  'Event branding & identity': 'Before the event',
  'Marketing materials': 'Before the event',
  'Full organisation & logistics': 'On the day',
  'Photography & videography': 'On the day',
  'Social media coverage': 'On the day',
  'Post-event evaluation': 'After the event',
};

// Events "What's included" — an event run-of-show. Each deliverable hangs off a single connected
// spine and is grouped by when it happens (before → on the day → after), with a check node that
// fills orange on hover (the "handled" moment). The connected timeline plus agenda phases are the
// distinguishing signature — flat, no cards, no numbers or chips — reading as the event schedule we
// cover end to end, distinct from every other scope variant.
function ScopeCoverage({ items }: { items: string[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, i) => {
        const phase = EVENT_SCOPE_PHASE[item];
        const isNewPhase = phase && phase !== EVENT_SCOPE_PHASE[items[i - 1]];
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        return (
          <div key={item} className="sd-reveal group/cv flex gap-5 md:gap-7">
            {/* Rail — a continuous spine threading each check node, so the list reads as one timeline. */}
            <div className="relative flex w-7 shrink-0 flex-col items-center self-stretch">
              <span aria-hidden className={cn('w-px flex-1', isFirst ? 'bg-transparent' : 'bg-white/12')} />
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 bg-charcoal text-orange transition-all duration-300 ease-out group-hover/cv:scale-110 group-hover/cv:border-orange group-hover/cv:bg-orange group-hover/cv:text-navy">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
                  <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span aria-hidden className={cn('w-px flex-1', isLast ? 'bg-transparent' : 'bg-white/12')} />
            </div>
            {/* Content — the phase caption prints once per group, like an agenda heading. */}
            <div className={cn('min-w-0 flex-1 pt-1.5', isLast ? 'pb-1.5' : 'pb-9')}>
              {isNewPhase && (
                <span className="mb-2 block text-sm font-semibold text-orange">{phase}</span>
              )}
              <span
                className="block font-sans font-bold tracking-tight text-white transition-transform duration-300 group-hover/cv:translate-x-1"
                style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}
              >
                {item}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-white/50">{EVENT_SCOPE_DESC[item]}</span>
            </div>
          </div>
        );
      })}
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

  if (service.slug === 'public-relations') return <PrInfluenceRoster />;
  if (service.slug === 'online-offline-marketing') return <MarketingFunnel />;
  if (service.slug === 'websites') return <WebsitesShowcase />;
  if (service.slug === 'mobile-applications') return <MobileAppShowcase />;
  if (service.slug === 'events') return <EventsJourney />;
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
