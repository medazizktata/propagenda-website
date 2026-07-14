'use client';

import { usePageTransition, TRANSITION_COLUMNS, TRANSITION_STAGGER_MS } from '@/hooks/usePageTransition';

export function PageTransitionLoader() {
  const phase = usePageTransition();

  if (phase === 'idle') return null;

  const anim = phase === 'cover' ? 'animate-page-cover' : 'animate-page-reveal';

  return (
    <div className="pointer-events-none fixed inset-0 z-loader flex" aria-hidden>
      {Array.from({ length: TRANSITION_COLUMNS }).map((_, i) => (
        <span
          key={i}
          className={`h-full flex-1 bg-orange ${anim}`}
          style={{ animationDelay: `${i * TRANSITION_STAGGER_MS}ms` }}
        />
      ))}
    </div>
  );
}
