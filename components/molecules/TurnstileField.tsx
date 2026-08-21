'use client';

import Script from 'next/script';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { TURNSTILE_ACTION } from '@/lib/forms/verifyTurnstile';

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action: string;
      theme?: 'light' | 'dark' | 'auto';
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';

export type TurnstileFieldHandle = {
  reset: () => void;
};

/**
 * Managed Turnstile for the contact brief.
 * No site key → renders nothing (local without Turnstile still posts if secret unset).
 */
export const TurnstileField = forwardRef<
  TurnstileFieldHandle,
  { onToken: (token: string | null) => void }
>(function TurnstileField({ onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const mount = useCallback(() => {
    if (!sitekey || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey,
      action: TURNSTILE_ACTION,
      theme: 'dark',
      callback: (token) => onToken(token),
      'expired-callback': () => onToken(null),
      'error-callback': () => onToken(null),
    });
  }, [onToken]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        onToken(null);
      }
    },
  }));

  useEffect(() => {
    if (scriptReady) mount();
  }, [scriptReady, mount]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!sitekey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div
        ref={containerRef}
        className="flex min-h-[65px] justify-center [&_iframe]:max-w-full"
      />
    </>
  );
});
