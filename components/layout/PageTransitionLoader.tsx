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
import { cn } from '@/components/ui/cn';

const QUOTE_ARM_MS = Math.round(COVER_MS * 0.5);

/**
 * Cover punch → logo always on → quote → bright scale-out reveal.
 */
export function PageTransitionLoader() {
  const { phase, targetPath } = usePageTransition();
  const [quote, setQuote] = useState<InitLoaderQuote | null>(null);
  const [curtain, setCurtain] = useState<LoaderCurtain>('wipe-up');
  const [playKey, setPlayKey] = useState(0);
  const [quoteArmed, setQuoteArmed] = useState(false);

  useEffect(() => {
    if (phase !== 'cover' || !targetPath) return;
    setQuote(quoteForPath(targetPath));
    setCurtain(curtainForPath(targetPath));
    setQuoteArmed(false);
    setPlayKey((k) => k + 1);
    const t = window.setTimeout(() => setQuoteArmed(true), QUOTE_ARM_MS);
    return () => window.clearTimeout(t);
  }, [phase, targetPath]);

  useEffect(() => {
    if (phase === 'idle') {
      setQuote(null);
      setQuoteArmed(false);
    }
  }, [phase]);

  if (phase === 'idle') return null;

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
