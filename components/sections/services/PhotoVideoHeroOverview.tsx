'use client';

import { cn } from '@/components/ui/cn';

const LABEL_W = '6.85em';

function Label({ children, spread }: { children: string; spread?: boolean }) {
  if (spread) {
    return (
      <span
        className="inline-flex shrink-0 justify-between bg-transparent font-semibold text-white"
        style={{ width: LABEL_W }}
      >
        {children.split('').map((ch, i) => (
          <span key={`${ch}-${i}`}>{ch}</span>
        ))}
      </span>
    );
  }
  return (
    <span
      className="inline-block shrink-0 bg-transparent font-semibold text-white"
      style={{ width: LABEL_W }}
    >
      {children}
    </span>
  );
}

export function PhotoVideoHeroOverview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'sd-reveal mx-auto mt-7 max-w-2xl space-y-2 text-base leading-relaxed [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] md:text-lg',
        className,
      )}
    >
      <p>
        <Label>Photography:</Label>{' '}
        <span className="text-white/80">
          products, brands, lifestyle, editorial, events, food, real estate, portraits, drone.
        </span>
      </p>
      <p>
        <Label spread>Video:</Label>{' '}
        <span className="text-white/80">
          explainer videos, products, testimonials, brand videos, animated videos, motion graphics, live
          streaming.
        </span>
      </p>
    </div>
  );
}
