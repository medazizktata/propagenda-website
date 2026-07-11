'use client';

import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { useInitLoader } from '@/hooks/useInitLoader';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function InitLoader() {
  const { visible } = useInitLoader();
  const reducedMotion = useReducedMotion();

  if (!visible || reducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-loader flex flex-col items-center justify-center bg-orange"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span
        aria-hidden
        className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-lg font-extrabold text-white"
      >
        P
      </span>
      <DisplayHeading as="p" size="display-xs" className="animate-loader-glitch text-center text-black">
        Looking for the Better Future
      </DisplayHeading>
    </div>
  );
}
