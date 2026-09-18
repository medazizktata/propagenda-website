'use client';

import Link from 'next/link';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { workGridCoverOverrides } from '@/lib/content/workGridCoverOverrides';
import type { CaseStudyRecord } from '@/types/content';

interface WorkCardProps {
  item: CaseStudyRecord;
}

/**
 * One tile of the work grid: a real project cover, visible at rest, with the client/title and
 * industry·year caption set beneath it (never overlaid — the cover stays unobstructed). Hover
 * and keyboard focus only lift the cover (scale + brightness) and light the caption; they never
 * gate whether the image is visible in the first place. A handful of studies are held without
 * imagery yet — those get a type-forward cover instead of an empty box, so the mixed grid still
 * reads as designed rather than broken.
 */
export function WorkCard({ item }: WorkCardProps) {
  const reducedMotion = useReducedMotion();
  const overrideIndex = workGridCoverOverrides[item.slug];
  const overrideCover = overrideIndex !== undefined ? item.gallery[overrideIndex]?.src : undefined;
  const cover = overrideCover ?? item.heroImage ?? item.gallery[0]?.src;
  const name = item.client ?? item.title;
  const caption = [item.industry, item.year].filter(Boolean).join('  ·  ');

  return (
    <li className="work-card-reveal">
      <Link href={`/work/${item.slug}`} className="group/card flex flex-col gap-4 outline-none">
        <div
          className={cn(
            'relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#1a1a1a] ring-1 ring-white/10 md:rounded-[1.5rem]',
            'transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-focus-visible/card:ring-2 group-focus-visible/card:ring-orange',
          )}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`${name}${item.industry ? ` — ${item.industry}` : ''}`}
              loading="lazy"
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center',
                !reducedMotion &&
                  'transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/card:scale-[1.05] group-hover/card:brightness-[1.06]',
              )}
            />
          ) : (
            <div aria-hidden className="absolute inset-0 flex items-end p-6">
              <span className="font-sans text-[3.5rem] font-bold leading-none text-white/15">
                {name.charAt(0)}
                <span className="text-orange">.</span>
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          />
        </div>
        <p className="flex flex-col gap-1">
          <span
            title={name}
            className="truncate font-sans text-base font-bold leading-tight text-white/90 transition-colors duration-300 group-hover/card:text-white md:text-lg"
          >
            {name}
            <span className="text-orange">.</span>
          </span>
          {caption ? (
            <span
              title={caption}
              className="truncate font-sans text-sm font-medium text-white/65 transition-colors duration-300 group-hover/card:text-white/80"
            >
              {caption}
            </span>
          ) : null}
        </p>
      </Link>
    </li>
  );
}
