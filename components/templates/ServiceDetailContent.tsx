'use client';

import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { ServiceRecord, ServiceSlug } from '@/types/content';
import { SERVICE_SLUGS } from '@/types/content';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { Measure, LeadText, MonoLabel, pad2 } from '@/components/ui/Editorial';
import { ServiceNextPrev } from '@/components/sections/services/ServiceNextPrev';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { serviceDetailConfig, type ProcessStep } from '@/components/sections/services/serviceDetailConfig';

/* ────────────────────────────────────────────────────────────────────────────
   SERVICE DETAIL — editorial document (graphichunters services grammar applied
   to one service's SECTIONS). Every section is a "row": a sticky hanging index +
   IBM Plex Mono label on the left rail, a measured column + oversized figures on
   the right. One protagonist per screen, orange as punctuation, no wallpaper.
   Content is preserved from `content/services*`; only the text + image LAYOUT is
   reframed. Legible-by-default: nothing is gated on scroll; reduced-motion is a
   fully-readable static path.
   ──────────────────────────────────────────────────────────────────────────── */

// Real portfolio renders stand in for per-service figures until dedicated
// /images/services assets land (mirrors the data note in content/servicesHub).
const PORTFOLIO = {
  sanapex: '/images/portfolio/work-sanapex.png',
  restaurant: '/images/portfolio/work-restaurant.png',
  quickcars: '/images/portfolio/work-quickcars.png',
  ghaftree: '/images/portfolio/work-ghaftree.png',
  events: '/images/portfolio/work-events.png',
  food: '/images/portfolio/work-food.png',
} as const;

// The one bright hero figure that pairs with each service's masthead standfirst.
const HERO_FIGURE: Record<ServiceSlug, { src: string; caption: string }> = {
  'branding-visual-identity': { src: PORTFOLIO.sanapex, caption: 'Sanapex Interiors — identity system' },
  'public-relations': { src: PORTFOLIO.food, caption: 'Influencer & media activation' },
  'online-offline-marketing': { src: PORTFOLIO.ghaftree, caption: 'Ghaf Tree — integrated campaign' },
  websites: { src: PORTFOLIO.quickcars, caption: 'Quick Cars — web build' },
  'mobile-applications': { src: PORTFOLIO.food, caption: 'Product app — interface' },
  events: { src: PORTFOLIO.events, caption: 'BIL Events — brand activation' },
  'photography-videography': { src: PORTFOLIO.restaurant, caption: 'Darabzeen Al Ward — brand shoot' },
};

// Branding scope gets a one-line descriptor per deliverable (real copy carried over
// from the previous bento). Other services stay name-only — leaner, like the reference.
const BRANDING_SCOPE_DESC: Record<string, string> = {
  'Logo design': 'A distinctive primary mark, built to last.',
  'Visual identity systems': 'Colour, type and graphics as one connected system.',
  'Brand colors & typography': 'A palette and type scale with real usage rules.',
  'Company profiles': 'Polished profiles that introduce you well.',
  'Brand guidelines': 'Every rule documented, so the brand stays consistent.',
  Stationery: 'Cards, letterheads and the everyday essentials.',
};

// Selected-work mosaic (real portfolio renders → /work).
const WORK = [
  { img: PORTFOLIO.sanapex, title: 'Sanapex Interiors' },
  { img: PORTFOLIO.restaurant, title: 'Darabzeen Al Ward' },
  { img: PORTFOLIO.quickcars, title: 'Quick Cars' },
  { img: PORTFOLIO.ghaftree, title: 'Ghaf Tree' },
  { img: PORTFOLIO.events, title: 'BIL Events' },
  { img: PORTFOLIO.food, title: 'Food & Lifestyle' },
];
const RELATED_IMAGES = [PORTFOLIO.sanapex, PORTFOLIO.quickcars, PORTFOLIO.ghaftree, PORTFOLIO.events];
const DISCIPLINE_IMAGES = [
  PORTFOLIO.food,
  PORTFOLIO.restaurant,
  PORTFOLIO.events,
  PORTFOLIO.sanapex,
  PORTFOLIO.quickcars,
  PORTFOLIO.ghaftree,
];

// Per-service framing for the "detail" section (title + mono label).
const DETAIL_FRAME: Partial<Record<ServiceSlug, { label: string; title: string }>> = {
  'branding-visual-identity': { label: 'Packages', title: 'Two levels of brand.' },
  'public-relations': { label: 'Reach', title: 'The right people, the right reach.' },
  'online-offline-marketing': { label: 'Focus', title: 'Full-funnel, online and off.' },
  events: { label: 'End to end', title: 'We handle the whole event.' },
  'photography-videography': { label: 'Disciplines', title: 'Every frame, every format.' },
};

// Package framing (branding) — real copy preserved from the previous tier board.
const PACKAGE_META: { summary: string; items: string[] }[] = [
  {
    summary: 'The essentials, ready to launch — the foundation your brand runs on.',
    items: ['Logo', 'Colour palette', 'Typography', 'Brand pattern', 'Business card', 'Letterhead', 'Envelopes'],
  },
  {
    summary: 'Everything in Basic — plus the voice, messaging and materials to run the whole brand.',
    items: [
      'Brand strategy',
      'Brand voice & tone',
      'Messaging & key lines',
      'Brand values',
      'Marketing collateral',
      'Full brand guidelines',
    ],
  },
];

export function ServiceDetailContent({ service }: { service: ServiceRecord }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const cfg = serviceDetailConfig[service.slug];
  const heroFigure = HERO_FIGURE[service.slug];
  const mastheadIndex = Math.max(0, SERVICE_SLUGS.indexOf(service.slug)) + 1;
  const phases: ProcessStep[] | null = cfg.approach ?? cfg.process ?? null;

  // Always show exactly 3 related-work links: the service's own first, padded from a pool.
  const relatedThree = [
    ...(service.relatedWork ?? []),
    { label: 'Sanapex Interiors', href: '/work' },
    { label: 'Quick Cars', href: '/work' },
    { label: 'Darabzeen Al Ward', href: '/work' },
    { label: 'BIL Events', href: '/work' },
  ]
    .filter((v, i, a) => a.findIndex((x) => x.label === v.label) === i)
    .slice(0, 3);

  // Fade-up reveals. Legible-by-default: `.sd-reveal` carries NO CSS opacity, so if JS
  // never runs the content is fully visible. Reduced motion snaps everything on.
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
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 90%', once: true },
          },
        );
      });
      ScrollTrigger.refresh();
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Assemble the document's numbered sections in order; indices are positional so a
  // missing section (e.g. no process) never leaves a gap in the numbering.
  const sections: { key: string; label: string; title: string; intro?: string; body: ReactNode }[] = [];

  sections.push({
    key: 'scope',
    label: 'Scope',
    title: 'What we deliver.',
    intro: 'The deliverables in every engagement — scoped to what your brand actually needs.',
    body: <ScopeList items={service.scopeItems} descriptions={service.slug === 'branding-visual-identity' ? BRANDING_SCOPE_DESC : undefined} />,
  });

  if (phases && phases.length > 0) {
    sections.push({
      key: 'approach',
      label: 'How we work',
      title: 'From brief to launch.',
      intro: 'A clear, staged process — you always know what ships, and when.',
      body: <PhaseRows phases={phases} />,
    });
  }

  const detailFrame = DETAIL_FRAME[service.slug];
  if (detailFrame) {
    let detailBody: ReactNode = null;
    if (service.slug === 'branding-visual-identity' && service.tiers?.length) {
      detailBody = <Packages tiers={service.tiers} />;
    } else if (service.slug === 'public-relations' && cfg.influence?.length) {
      detailBody = <CapabilityList items={cfg.influence} />;
    } else if (service.slug === 'online-offline-marketing' && service.extendedBullets?.length) {
      detailBody = <CapabilityList items={service.extendedBullets} />;
    } else if (service.slug === 'events' && service.eventChecklist?.length) {
      detailBody = <CapabilityList items={service.eventChecklist} />;
    } else if (service.slug === 'photography-videography' && cfg.disciplines?.length) {
      detailBody = <Disciplines disciplines={cfg.disciplines} />;
    }
    if (detailBody) {
      sections.push({ key: 'detail', label: detailFrame.label, title: detailFrame.title, body: detailBody });
    }
  }

  sections.push({
    key: 'work',
    label: 'Selected work',
    title: 'Work we stand behind.',
    body: <WorkMosaic />,
  });

  if (cfg.faqs && cfg.faqs.length > 0) {
    sections.push({
      key: 'faq',
      label: 'FAQ',
      title: 'Common questions.',
      body: <Faq faqs={cfg.faqs} />,
    });
  }

  sections.push({
    key: 'related',
    label: 'Related work',
    title: 'See it in the wild.',
    body: <RelatedRows items={relatedThree} />,
  });

  return (
    <div ref={rootRef} className="bg-charcoal">
      {/* ── MASTHEAD — type is the protagonist; flat ground, no wallpaper ───────── */}
      <section className="bg-charcoal px-gutter-m pb-14 pt-32 lg:px-gutter-d lg:pb-20 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="sd-reveal flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-sm font-medium tabular-nums text-orange">{pad2(mastheadIndex)}</span>
            <span aria-hidden className="h-px w-8 shrink-0 bg-orange/55" />
            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <Link href="/services" className="transition-hover hover-fine:hover:text-orange">
                <MonoLabel>Services</MonoLabel>
              </Link>
              <MonoLabel className="!text-white/25">/</MonoLabel>
              <MonoLabel className="!text-white/70">{service.title}</MonoLabel>
            </nav>
          </div>

          <h1 className="sd-reveal mt-8 font-sans font-extrabold uppercase leading-[0.9] tracking-display text-white text-display-sm">
            {service.h1}
            <span className="text-orange">.</span>
          </h1>

          <Measure width="lead" className="sd-reveal mt-8">
            <LeadText>{service.overview}</LeadText>
          </Measure>

          {service.scopeItems.length > 0 && (
            <div className="sd-reveal mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
              {service.scopeItems.slice(0, 5).map((item, i) => (
                <Fragment key={item}>
                  {i > 0 && (
                    <span aria-hidden className="text-white/25">
                      ·
                    </span>
                  )}
                  <MonoLabel>{item}</MonoLabel>
                </Fragment>
              ))}
            </div>
          )}

          <div className="sd-reveal mt-11">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-pill bg-orange px-8 py-3 text-base font-bold uppercase tracking-wide text-navy transition-hover hover-fine:hover:bg-orange-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Start your project
              <span aria-hidden className="ml-2">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HERO FIGURE — the bright protagonist image (stacked, never under type) ── */}
      {heroFigure && (
        <div className="border-t border-white/12 px-gutter-m py-12 lg:px-gutter-d lg:py-16">
          <figure className="sd-reveal mx-auto max-w-6xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.03] md:aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroFigure.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <FigCaption>{heroFigure.caption}</FigCaption>
          </figure>
        </div>
      )}

      {/* ── DOCUMENT SECTIONS — hanging index + sticky mono rail per row ──────────── */}
      {sections.map((s, i) => (
        <DocSection key={s.key} id={s.key} index={i + 1} label={s.label} title={s.title} intro={s.intro}>
          {s.body}
        </DocSection>
      ))}

      {/* ── NEXT / PREV service (signature, no wallpaper) ────────────────────────── */}
      <ServiceNextPrev slug={service.slug} />

      {/* ── CLOSING CTA — the page's one orange flood; near-black text on orange ──── */}
      <ClosingCta line1={cfg.ctaLine1} line2={cfg.ctaLine2} tertiary={service.tertiaryCta} />
    </div>
  );
}

/* ───────────────────────────── Section shell ───────────────────────────── */

function DocSection({
  index,
  label,
  title,
  intro,
  id,
  children,
}: {
  index: number;
  label: string;
  title: string;
  intro?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/12 px-gutter-m py-14 lg:px-gutter-d lg:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-y-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-x-16">
        <header className="sd-reveal self-start lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-medium tabular-nums text-orange">{pad2(index)}</span>
            <MonoLabel>{label}</MonoLabel>
          </div>
          <h2 className="mt-5 font-sans text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-[2.1rem]">
            {title}
          </h2>
          {intro && (
            <p className="mt-5 max-w-measure-narrow text-base leading-relaxed text-white/55">{intro}</p>
          )}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function FigCaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-4 flex items-center gap-3">
      <span aria-hidden className="h-px w-8 shrink-0 bg-orange/60" />
      <MonoLabel>{children}</MonoLabel>
    </figcaption>
  );
}

/* ───────────────────────────── Scope ───────────────────────────── */

function ScopeList({ items, descriptions }: { items: string[]; descriptions?: Record<string, string> }) {
  if (items.length === 0) return null;
  return (
    <ol className="sd-reveal border-t border-white/10">
      {items.map((item, i) => (
        <li key={item} className="flex gap-5 border-b border-white/10 py-5">
          <span className="mt-1 font-mono text-xs font-medium tabular-nums text-white/35">
            {pad2(i + 1)}
          </span>
          <div className="min-w-0">
            <span className="font-sans text-lg font-semibold tracking-tight text-white md:text-xl">
              {item}
            </span>
            {descriptions?.[item] && (
              <p className="mt-1 text-sm leading-relaxed text-white/55">{descriptions[item]}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── Approach ───────────────────────────── */

function PhaseRows({ phases }: { phases: ProcessStep[] }) {
  return (
    <ol className="sd-reveal border-t border-white/10">
      {phases.map((p, i) => (
        <li key={p.title} className="grid gap-x-6 gap-y-2 border-b border-white/10 py-6 sm:grid-cols-[2.75rem_minmax(0,1fr)]">
          <span className="font-mono text-sm font-medium tabular-nums text-orange">{pad2(i + 1)}</span>
          <div className="min-w-0">
            <h3 className="font-sans text-xl font-bold tracking-tight text-white">{p.title}</h3>
            <p className="mt-2 max-w-measure leading-relaxed text-white/65">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── Capability list ───────────────────────────── */

// PR reach / marketing focus / event checklist — the big-name editorial row.
function CapabilityList({ items }: { items: string[] }) {
  return (
    <ul className="sd-reveal border-t border-white/10">
      {items.map((item, i) => (
        <li
          key={item}
          className="group/cap flex items-baseline gap-5 border-b border-white/10 py-5 transition-colors duration-300 hover-fine:hover:border-orange/40"
        >
          <span className="font-mono text-xs font-medium tabular-nums text-white/35">{pad2(i + 1)}</span>
          <span className="font-sans text-xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover/cap:text-orange md:text-2xl">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────────── Packages (branding) ───────────────────────────── */

function Packages({ tiers }: { tiers: { name: string; items: string[] }[] }) {
  return (
    <div className="sd-reveal border-t border-white/10">
      {tiers.map((tier, i) => {
        const meta = PACKAGE_META[i];
        const items = meta?.items ?? tier.items;
        return (
          <div key={tier.name} className="border-b border-white/10 py-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-medium tabular-nums text-orange">{pad2(i + 1)}</span>
              <MonoLabel tone="accent">{i === 0 ? 'Foundation' : 'Complete system'}</MonoLabel>
            </div>
            <h3 className="mt-3 font-sans text-2xl font-bold capitalize tracking-tight text-white md:text-[1.7rem]">
              {tier.name}
              <span className="text-orange">.</span>
            </h3>
            {meta?.summary && <p className="mt-2 max-w-measure leading-relaxed text-white/60">{meta.summary}</p>}
            <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {items.map((it) => (
                <li key={it} className="flex gap-3 text-white/80">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange" />
                  <span className="text-[0.95rem] leading-snug">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Disciplines (photography) ───────────────────────────── */

function Disciplines({ disciplines }: { disciplines: { label: string; items: string[] }[] }) {
  return (
    <div className="sd-reveal flex flex-col gap-12">
      {disciplines.map((d, di) => (
        <div key={d.label}>
          <div className="flex items-center gap-4 border-t border-white/10 pt-5">
            <span className="font-mono text-xs font-medium tabular-nums text-orange">{pad2(di + 1)}</span>
            <MonoLabel tone="accent">{d.label}</MonoLabel>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-1.5">
            {d.items.map((item) => (
              <li key={item} className="font-sans text-lg font-medium text-white/85">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {d.items.slice(0, 3).map((item, i) => (
              <div key={item} className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISCIPLINE_IMAGES[(di * 3 + i) % DISCIPLINE_IMAGES.length]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out hover-fine:hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── Selected work ───────────────────────────── */

// Asymmetric editorial mosaic — one feature tile, varied spans; captions stay legible.
const WORK_SPANS = ['col-span-2 row-span-2', 'col-span-2', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-2'];

function WorkMosaic() {
  return (
    <div className="sd-reveal">
      <div className="grid auto-rows-[8.5rem] grid-cols-2 gap-3 md:auto-rows-[10.5rem] md:grid-cols-4">
        {WORK.map((w, i) => (
          <Link
            key={w.img}
            href="/work"
            className={cn('group/tile relative overflow-hidden bg-white/[0.03]', WORK_SPANS[i % WORK_SPANS.length])}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={w.img}
              alt={w.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tile:scale-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 font-mono text-[0.7rem] uppercase tracking-label text-white/85">
              {w.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-label text-white/60 transition-hover hover-fine:hover:text-orange"
        >
          View all work
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────────────── Related work ───────────────────────────── */

function RelatedRows({ items }: { items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="sd-reveal grid gap-4 sm:grid-cols-3">
      {items.map((rw, i) => (
        <Link key={`${rw.href}-${i}`} href={rw.href} className="group/rw block">
          <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RELATED_IMAGES[i % RELATED_IMAGES.length]}
              alt=""
              className="h-full w-full object-cover grayscale-[0.3] transition-all duration-500 ease-out group-hover/rw:scale-105 group-hover/rw:grayscale-0"
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden className="h-px w-6 shrink-0 bg-orange/50 transition-all duration-300 group-hover/rw:w-9" />
            <span className="font-sans text-base font-semibold tracking-tight text-white transition-colors group-hover/rw:text-orange">
              {rw.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ───────────────────────────── FAQ ───────────────────────────── */

function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  // Reusable accordion with cuberto-style elastic-string dividers that pluck toward
  // the cursor and spring back. Same open/toggle behavior as before, plus the effect.
  return (
    <div className="sd-reveal">
      <FAQAccordion items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
    </div>
  );
}

/* ───────────────────────────── Closing CTA ───────────────────────────── */

function ClosingCta({
  line1,
  line2,
  tertiary,
}: {
  line1: string;
  line2: string;
  tertiary?: { label: string; href: string };
}) {
  return (
    <section className="bg-orange px-gutter-m py-20 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-4xl">
        <MonoLabel tone="ink">Start here</MonoLabel>
        <h2 className="mt-4 font-sans text-4xl font-extrabold uppercase leading-[0.95] tracking-display text-navy md:text-6xl">
          {line1}
          <br />
          {line2}
        </h2>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-pill bg-navy px-8 py-3 text-base font-bold uppercase tracking-wide text-white transition-hover hover-fine:hover:bg-navy/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Start your project
            <span aria-hidden className="ml-2">
              &rarr;
            </span>
          </Link>
          {tertiary && (
            <Link
              href={tertiary.href}
              className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-label text-navy/80 transition-hover hover-fine:hover:text-navy"
            >
              {tertiary.label}
              <span aria-hidden>&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
