'use client';

import { cn } from '@/components/ui/cn';

const LINES = [
  {
    label: 'Photography',
    body: 'products, brands, lifestyle, editorial, events, food, real estate, portraits, drone.',
  },
  {
    label: 'Video',
    body: 'explainer videos, products, testimonials, brand videos, animated videos, motion graphics, live streaming.',
  },
] as const;

export function PhotoVideoHeroOverview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'sd-reveal mx-auto mt-7 grid max-w-2xl gap-x-4 gap-y-2.5 text-left text-base leading-relaxed md:text-lg',
        'grid-cols-[auto_minmax(0,1fr)]',
        className,
      )}
    >
      {LINES.map((line) => (
        <div key={line.label} className="contents">
          <span className="font-semibold text-white">{line.label}</span>
          <span className="text-white/75">{line.body}</span>
        </div>
      ))}
    </div>
  );
}
