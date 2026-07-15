'use client';

import { useEffect, useRef, useState } from 'react';
import { useInitLoader } from '@/hooks/useInitLoader';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { pickInitLoaderQuote } from '@/content/initLoaderQuotes';
import { LoaderQuoteText } from '@/components/molecules/LoaderQuoteText';
import { LoaderSplashLogo } from '@/components/molecules/LoaderSplashLogo';
import { LoaderCurtainShell } from '@/components/molecules/LoaderCurtainShell';
import { cn } from '@/components/ui/cn';

const CONTENT_ARM_MS = 140;

/**
 * Orange quote splash: logo always on, quote arms after cover beat.
 * Toggle with NEXT_PUBLIC_INIT_LOADER=false in .env.local.
 */

export function InitLoader() {
  const { visible, enabled } = useInitLoader();
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [removed, setRemoved] = useState(false);
  const [quote] = useState(() => pickInitLoaderQuote());
  const [armed, setArmed] = useState(false);
  const [shellIn, setShellIn] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShellIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!visible) return;
    setArmed(false);
    const t = window.setTimeout(() => setArmed(true), CONTENT_ARM_MS);
    return () => window.clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const duration = 900;
    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  useEffect(() => {
    if (visible) return;
    ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => setRemoved(true), 280);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (!enabled || reducedMotion || removed) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-loader transition-[opacity,transform,filter] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible && shellIn
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
        !visible && 'scale-[1.04] brightness-125',
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <LoaderCurtainShell
        curtain={quote.curtain}
        animateCover={shellIn}
        patternKey={shellIn ? 'init' : 0}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 md:gap-10">
        <LoaderSplashLogo playKey={shellIn ? 'init' : 0} />
        {armed ? <LoaderQuoteText quote={quote} playKey="init" size="init" /> : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-1 w-full bg-navy/15">
        <div
          className="h-full bg-navy transition-[width] duration-150 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>
    </div>
  );
}
