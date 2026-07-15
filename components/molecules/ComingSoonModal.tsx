'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { Button } from '@/components/ui/Button';
import { softLaunchCopy } from '@/content/softLaunch';
import {
  isSoftLaunchEnabled,
  openComingSoonModal,
  SOFT_LAUNCH_EVENT,
  SOFT_LAUNCH_QUERY,
} from '@/lib/softLaunch';
import { cn } from '@/components/ui/cn';

const EXIT_MS = 280;

/**
 * Soft-launch gate modal. Opens on:
 * - CustomEvent `propagenda:coming-soon` (nav click interceptor)
 * - `?soon=1` after middleware redirects a locked URL to home
 */
export function ComingSoonModal() {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const enabled = isSoftLaunchEnabled();

  const close = useCallback(() => {
    setEntered(false);
    window.setTimeout(() => setMounted(false), EXIT_MS);

    if (searchParams.get(SOFT_LAUNCH_QUERY)) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete(SOFT_LAUNCH_QUERY);
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  const open = useCallback(() => {
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onEvent = () => open();
    window.addEventListener(SOFT_LAUNCH_EVENT, onEvent);
    return () => window.removeEventListener(SOFT_LAUNCH_EVENT, onEvent);
  }, [enabled, open]);

  useEffect(() => {
    if (!enabled) return;
    if (searchParams.get(SOFT_LAUNCH_QUERY) === '1') {
      openComingSoonModal();
    }
  }, [enabled, searchParams]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, close]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-gutter-m"
      role="presentation"
    >
      {/* Atmosphere */}
      <button
        type="button"
        aria-label="Dismiss"
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          'bg-[radial-gradient(ellipse_at_center,rgba(245,139,39,0.22)_0%,transparent_55%),rgba(15,21,31,0.82)]',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative w-full max-w-xl overflow-hidden text-white',
          'bg-charcoal ring-1 ring-white/10',
          'transition-all duration-300 ease-out',
          entered
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-6 opacity-0 scale-[0.98] sm:translate-y-3',
        )}
      >
        {/* Orange crown strip */}
        <div className="h-1.5 w-full bg-orange" aria-hidden />

        <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden>
          <BrandPattern variant="dense" id="coming-soon" half="right" />
        </div>

        {/* Soft orange wash from top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange/25 blur-3xl"
        />

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className={cn(
            'absolute right-4 top-5 z-20 flex h-10 w-10 items-center justify-center',
            'text-white/55 transition-colors hover-fine:hover:text-white',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
          )}
          aria-label="Close"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="relative z-10 px-8 pb-10 pt-9 sm:px-12 sm:pb-12 sm:pt-11">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo-mark.svg"
            alt=""
            className="h-11 w-11 select-none"
            draggable={false}
          />

          <p className="mt-8 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-orange">
            {softLaunchCopy.eyebrow}
          </p>

          <h2
            id={titleId}
            className="mt-3 max-w-[12ch] font-sans text-[clamp(2.4rem,8vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-display"
          >
            {softLaunchCopy.titleLead}{' '}
            <span className="accent-word">{softLaunchCopy.titleAccent}</span>
          </h2>

          <div className="mt-6 h-px w-16 bg-orange/80" aria-hidden />

          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-white/65 sm:text-[0.95rem]">
            {softLaunchCopy.body}
          </p>

          <div className="mt-9">
            <Button type="button" variant="primary" size="lg" onClick={close}>
              {softLaunchCopy.cta}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
