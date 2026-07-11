'use client';

import { usePageTransition } from '@/hooks/usePageTransition';

export function PageTransitionLoader() {
  const active = usePageTransition();

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-loader flex" aria-hidden>
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="h-full flex-1 origin-top bg-orange animate-line-wipe"
          style={{ animationDelay: `${i * 12}ms` }}
        />
      ))}
    </div>
  );
}
