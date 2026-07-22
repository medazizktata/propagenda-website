'use client';

import { useRef, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { WorkIndexRow } from '@/components/sections/WorkIndexRow';
import type { CaseStudyRecord } from '@/types/content';

export interface WorkIndexGroup {
  id: string;
  /** Sentence/title-case category label (e.g. "Automotive", "Property & interiors") — no tracked caps. */
  label: string;
  items: CaseStudyRecord[];
}

interface WorkIndexProps {
  groups: WorkIndexGroup[];
}

/**
 * The Work hub centrepiece: an oversized, full-width "famous work" index. Case studies are
 * split into broad category sections (Automotive, Property & interiors, …); each study is
 * one giant type row; hover/focus blooms its REAL heroImage full-bleed behind the names
 * (fast fade layered over a slow 5s Ken-Burns zoom), siblings dim, and its industry/year
 * caption appears. Every category section shares one bloom panel and one running active index.
 * At rest the flagship hero sits softly behind the names so the section is image-forward,
 * never a void. Reduced-motion: instant swaps, a single fixed scale, no zoom.
 */
export function WorkIndex({ groups }: WorkIndexProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  useFadeUpOnEnter(ref, '.work-index-reveal');

  // Flatten so the bloom panel + active index span both groups with one running index.
  const flat = groups.flatMap((g) => g.items);

  return (
    <section
      ref={ref}
      onMouseLeave={() => setActive(null)}
      className="relative overflow-hidden bg-charcoal px-gutter-m py-24 lg:px-gutter-d lg:py-32"
    >
      {/* Bloom panel — the active project's real hero fills the whole section (Ken-Burns). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {flat.map((item, i) =>
          item.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.slug}
              src={item.heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
              style={{
                opacity: active === i ? 1 : i === 0 && active === null ? 0.4 : 0,
                transitionProperty: 'opacity, transform',
                transitionDuration: reducedMotion ? '200ms, 0ms' : '450ms, 5000ms',
                transitionTimingFunction: 'cubic-bezier(0.215,0.61,0.355,1), ease-out',
                transform: reducedMotion
                  ? 'scale(1.02)'
                  : active === i
                    ? 'scale(1.16)'
                    : 'scale(1.04)',
              }}
            />
          ) : null,
        )}
        {/* Scrims — keep the giant names legible while the work still reads through. */}
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/20 to-charcoal/60" />
      </div>

      <div className="relative z-content mx-auto flex w-full max-w-6xl flex-col gap-16 md:gap-24">
        {groups.map((group, gi) => {
          // Running offset so each row's index is unique across all groups.
          const offset = groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0);
          return (
            <div key={group.id} id={group.id}>
              <div className="work-index-reveal mb-4 border-b border-white/12 pb-3 md:mb-6">
                <h2 className="font-sans text-lg font-semibold text-orange md:text-xl">
                  {group.label}
                </h2>
              </div>
              <ul className="flex flex-col">
                {group.items.map((item, i) => {
                  const caption = [item.industry, item.year].filter(Boolean).join('  ·  ');
                  return (
                    <li key={item.slug} className="work-index-reveal">
                      <WorkIndexRow
                        index={offset + i}
                        href={`/work/${item.slug}`}
                        name={item.client ?? item.title}
                        caption={caption}
                        isActive={active === offset + i}
                        isDimmed={active !== null && active !== offset + i}
                        onActivate={setActive}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
