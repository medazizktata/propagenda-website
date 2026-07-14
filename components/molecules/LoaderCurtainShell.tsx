'use client';

import type { ReactNode } from 'react';
import type { LoaderCurtain } from '@/content/initLoaderQuotes';
import { curtainCoverClass } from '@/content/initLoaderQuotes';
import { LoaderPattern } from '@/components/molecules/LoaderPattern';
import { cn } from '@/components/ui/cn';

const BLIND_COUNT = 8;
const BLIND_OVERLAP_PX = 3;

type LoaderCurtainShellProps = {
  curtain: LoaderCurtain;
  animateCover?: boolean;
  /** Stable key so pattern entrance plays once per splash. */
  patternKey?: string | number;
  className?: string;
  children?: ReactNode;
};

/**
 * Full-bleed orange shell. Exactly one LoaderPattern instance — never duplicated.
 */
export function LoaderCurtainShell({
  curtain,
  animateCover = true,
  patternKey = 0,
  className,
  children,
}: LoaderCurtainShellProps) {
  const blinds = curtain === 'blinds';

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden bg-orange',
        !blinds && animateCover && curtainCoverClass(curtain),
        className,
      )}
    >
      {/* Single pattern field for every curtain type. */}
      <LoaderPattern playKey={patternKey} className="z-0" />

      {blinds ? (
        <div className="absolute inset-0 z-[1] flex flex-col">
          {Array.from({ length: BLIND_COUNT }, (_, i) => (
            <div
              key={i}
              className={cn(
                'relative min-h-0 flex-1 bg-orange',
                animateCover && 'animate-loader-cover-blind',
              )}
              style={{
                marginBottom: i < BLIND_COUNT - 1 ? -BLIND_OVERLAP_PX : 0,
                flex: '1 1 0%',
                ...(animateCover
                  ? { animationDelay: `${i * 0.028}s` }
                  : { opacity: 0 }),
              }}
            />
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}
