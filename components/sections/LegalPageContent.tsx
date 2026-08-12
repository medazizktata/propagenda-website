'use client';

import { useEffect, useState } from 'react';
import type { LegalRecord } from '@/types/content';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/* ── helpers ───────────────────────────────────────────────────────────── */

const pad2 = (n: number) => String(n).padStart(2, '0');
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
const isPhone = (s: string) => /^\+?[\d\s()-]{7,}$/.test(s.trim());
const mailHref = (v: string) => `mailto:${v.trim()}`;
const telHref = (v: string) => `tel:${v.replace(/\s+/g, '')}`;
const hoverLink = 'transition-hover hover-fine:hover:text-orange';

/** Small "backstage" label — the site's mono eyebrow voice; orange used sparingly. */
function Backstage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('font-mono text-xs uppercase tracking-[0.2em] text-orange', className)}>
      {children}
    </p>
  );
}

/**
 * A single contact/address line. Auto-links bare emails/phones, and for labelled lines
 * ("Email: x@y.z", "Phone: +971 …") keeps the label muted and links only the value.
 */
function AddressLine({ line, strong }: { line: string; strong?: boolean }) {
  const size = strong ? 'font-sans text-lg font-semibold text-white md:text-xl' : 'text-base';

  const labelled = line.match(/^([A-Za-z][A-Za-z ]*?):\s*(.+)$/);
  if (labelled) {
    const [, label, value] = labelled;
    const href = isEmail(value) ? mailHref(value) : isPhone(value) ? telHref(value) : undefined;
    return (
      <span className={cn(size, 'text-white/70')}>
        <span className="text-white/55">{label}: </span>
        {href ? (
          <a href={href} className={cn('text-white/85', hoverLink)}>
            {value}
          </a>
        ) : (
          <span className="text-white/85">{value}</span>
        )}
      </span>
    );
  }
  if (isEmail(line)) {
    return (
      <a href={mailHref(line)} className={cn(size, 'w-fit text-white/85', hoverLink)}>
        {line}
      </a>
    );
  }
  if (isPhone(line)) {
    return (
      <a href={telHref(line)} className={cn(size, 'w-fit text-white/85', hoverLink)}>
        {line}
      </a>
    );
  }
  return <span className={cn(size, strong ? 'text-white' : 'text-white/70')}>{line}</span>;
}

/* ── Imprint (calm centred identity) ───────────────────────────────────── */

function ImprintView({ legal }: { legal: LegalRecord }) {
  const lines = legal.sections[0]?.paragraphs ?? [];
  return (
    <article className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-charcoal px-gutter-m py-28 text-center lg:py-36">
      {/* Full-bleed brand pattern filling the entire viewport behind the identity. */}
      <BrandPattern variant="dense" className="opacity-[0.16]" />
      <div className="relative z-content mx-auto flex max-w-measure flex-col items-center">
        <Backstage>Legal</Backstage>
        <h1
          className="mt-6 font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          {legal.h1}
        </h1>
        {lines.length > 0 && (
          <div className="mt-12 flex w-full flex-col items-center gap-2 text-center">
            <p className="w-full break-words text-base font-semibold text-white md:text-xl">
              {lines[0]}
            </p>
            {lines.slice(1).map((line) => (
              <div key={line} className="w-full">
                <AddressLine line={line} />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Policy (privacy / terms — rail + numbered sections, live scroll-spy) ─ */

type PolicyItem = { heading: string; paragraphs: string[]; index: number; id: string };

function PolicyView({ legal }: { legal: LegalRecord }) {
  const reduced = useReducedMotion();

  const [first, ...tail] = legal.sections;
  const hasIntro = Boolean(first && !first.heading);
  const introParas = hasIntro ? first.paragraphs : [];
  const bodySections = hasIntro ? tail : legal.sections;

  const updated = introParas
    .find((p) => /^last updated/i.test(p))
    ?.replace(/^last updated:?\s*/i, '')
    .replace(/\.$/, '');
  const leadParas = introParas.filter((p) => !/^last updated/i.test(p));

  const items: PolicyItem[] = bodySections.map((s, i) => ({
    heading: s.heading ?? `Section ${i + 1}`,
    paragraphs: s.paragraphs,
    index: i + 1,
    id: s.heading ? slugify(s.heading) : `section-${i + 1}`,
  }));

  const wordCount = legal.sections
    .flatMap((s) => s.paragraphs)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));

  // Live scroll-spy: highlight the section currently near the top of the viewport.
  const [active, setActive] = useState(items[0]?.id ?? '');
  const idsKey = items.map((i) => i.id).join('|');
  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : [];
    if (ids.length === 0) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const topmost = ids.find((id) => visible.has(id));
        if (topmost) setActive(topmost);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [idsKey]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (typeof history !== 'undefined') history.replaceState(null, '', `#${id}`);
    setActive(id);

    // Manual rAF tween — native scrollTo({behavior:'smooth'}) is suppressed by some
    // Chromium builds, so we animate scrollY ourselves (offset clears the fixed header).
    const start = window.scrollY;
    const dist = el.getBoundingClientRect().top + start - 100 - start;
    if (reduced || Math.abs(dist) < 2) {
      window.scrollTo(0, start + dist);
      return;
    }
    const duration = Math.min(720, Math.max(340, Math.abs(dist) * 0.6));
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <article className="bg-charcoal px-gutter-m pb-32 pt-32 lg:px-gutter-d lg:pb-40 lg:pt-40">
      {/* Masthead — DOMINANT H1, subordinate lead, one tidy meta line. */}
      <header className="max-w-3xl">
        <Backstage>Legal</Backstage>
        <h1
          className="mt-6 font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(2.1rem, 5.6vw, 4.75rem)' }}
        >
          {legal.h1}
        </h1>
        {leadParas.length > 0 && (
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-white/75 md:text-[1.3rem]">
            {leadParas.join(' ')}
          </p>
        )}
        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-white/55">
          {updated && (
            <>
              <span>Updated {updated}</span>
              <span aria-hidden className="text-white/25">/</span>
            </>
          )}
          <span>{items.length} sections</span>
          <span aria-hidden className="text-white/25">/</span>
          <span>~{minutes} min read</span>
        </p>
      </header>

      {/* Body — sticky scroll-spy rail + numbered, measured sections. */}
      <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              On this page
            </p>
            <ol className="space-y-1">
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => jump(e, item.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'flex items-baseline gap-3 py-1.5 text-sm leading-snug transition-hover',
                        isActive ? 'text-white' : 'text-white/50 hover-fine:hover:text-white/80',
                      )}
                    >
                      <span
                        className={cn(
                          'font-mono text-xs tabular-nums',
                          isActive ? 'text-orange' : 'text-white/45',
                        )}
                      >
                        {pad2(item.index)}
                      </span>
                      <span>{item.heading}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="space-y-14 lg:space-y-16">
          {items.map((item) => (
            <section key={item.id} id={item.id} className="scroll-mt-28">
              <header className="border-t border-white/10 pt-6">
                <h2 className="flex items-center gap-4 font-sans text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.7rem]">
                  <span className="shrink-0 font-mono text-3xl font-semibold tabular-nums leading-none text-orange md:text-4xl">
                    {pad2(item.index)}
                  </span>
                  <span>{item.heading}</span>
                </h2>
              </header>
              {item.heading === 'Contact' ? (
                <div className="mt-6 flex flex-col gap-1.5">
                  {item.paragraphs.map((line, li) => (
                    <AddressLine key={line} line={line} strong={li === 0} />
                  ))}
                </div>
              ) : (
                <div className="prose-editorial mt-6 max-w-measure">
                  {item.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── entry ─────────────────────────────────────────────────────────────── */

export function LegalPageContent({ legal }: { legal: LegalRecord }) {
  const isImprint = legal.slug === 'imprint' || legal.centered;
  return isImprint ? <ImprintView legal={legal} /> : <PolicyView legal={legal} />;
}
