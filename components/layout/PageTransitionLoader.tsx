'use client';

import { useEffect, useState } from 'react';
import { usePageTransition, COVER_MS } from '@/hooks/usePageTransition';
import {
  curtainForPath,
  quoteForPath,
  type InitLoaderQuote,
  type LoaderCurtain,
} from '@/content/initLoaderQuotes';
import { LoaderQuoteText } from '@/components/molecules/LoaderQuoteText';
import { LoaderSplashLogo } from '@/components/molecules/LoaderSplashLogo';
import { LoaderCurtainShell } from '@/components/molecules/LoaderCurtainShell';
import { ffComplexCurtain } from '@/lib/featureFlags';
import { cn } from '@/components/ui/cn';

const QUOTE_ARM_MS = Math.round(COVER_MS * 0.5);

/**
 * Cover punch → logo always on → quote → bright scale-out reveal (complex curtain), or a clean
 * Cuberto-style panel wipe when NEXT_PUBLIC_FF_COMPLEX_CURTAIN=false.
 */
export function PageTransitionLoader() {
  const { phase, targetPath } = usePageTransition();
  const [quote, setQuote] = useState<InitLoaderQuote | null>(null);
  const [curtain, setCurtain] = useState<LoaderCurtain>('wipe-up');
  const [playKey, setPlayKey] = useState(0);
  const [quoteArmed, setQuoteArmed] = useState(false);

  useEffect(() => {
    if (!ffComplexCurtain) return;
    if (phase !== 'cover' || !targetPath) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync the loader's display state to the nav phase
    setQuote(quoteForPath(targetPath));
    setCurtain(curtainForPath(targetPath));
    setQuoteArmed(false);
    setPlayKey((k) => k + 1);
    const t = window.setTimeout(() => setQuoteArmed(true), QUOTE_ARM_MS);
    return () => window.clearTimeout(t);
  }, [phase, targetPath]);

  useEffect(() => {
    if (phase === 'idle') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loader state when the transition ends
      setQuote(null);
      setQuoteArmed(false);
    }
  }, [phase]);

  if (phase === 'idle') return null;

  // Cuberto-style: one solid panel wipes up over the page (cover), then retracts off the top
  // (reveal). No quote, logo or pattern — just the clean directional wipe.
  if (!ffComplexCurtain) {
    return (
      <div className="pointer-events-none fixed inset-0 z-loader" aria-hidden>
        <div
          className={cn(
            'absolute inset-0 bg-orange will-change-transform',
            phase === 'cover' && 'animate-cuberto-cover',
            phase === 'reveal' && 'animate-cuberto-reveal',
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-loader',
        phase === 'cover' && 'animate-loader-shell-in',
        phase === 'reveal' && 'animate-page-reveal',
      )}
      aria-hidden
    >
      <LoaderCurtainShell
        curtain={curtain}
        animateCover={phase === 'cover' || phase === 'reveal'}
        patternKey={playKey}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6 md:gap-10',
          phase === 'reveal' && 'animate-loader-content-out',
        )}
      >
        <LoaderSplashLogo playKey={playKey} />
        {quote && quoteArmed ? (
          <LoaderQuoteText quote={quote} playKey={playKey} size="transition" />
        ) : null}
      </div>
    </div>
  );
}
