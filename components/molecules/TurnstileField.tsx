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
import { TURNSTILE_ACTION, TURNSTILE_SITE_KEY } from '@/lib/forms/verifyTurnstile';

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action: string;
      theme?: 'light' | 'dark' | 'auto';
      appearance?: 'always' | 'execute' | 'interaction-only';
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

const sitekey = TURNSTILE_SITE_KEY;

export type TurnstileFieldHandle = {
  reset: () => void;
};

/**
 * Managed Turnstile for the contact brief.
 * Requires NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time.
 */
export const TurnstileField = forwardRef<
  TurnstileFieldHandle,
  { onToken: (token: string | null) => void }
>(function TurnstileField({ onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const mount = useCallback(() => {
    if (!sitekey || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey,
      action: TURNSTILE_ACTION,
      theme: 'dark',
      appearance: 'always',
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

  if (!sitekey) {
    return (
      <p className="text-center text-xs text-error" role="alert">
        Verification unavailable. Please email us directly.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setScriptError(true)}
      />
      {scriptError ? (
        <p className="text-center text-xs text-error" role="alert">
          Verification blocked — disable ad blocker for this site or email us directly.
        </p>
      ) : (
        <div
          ref={containerRef}
          className="flex min-h-[65px] justify-center [&_iframe]:max-w-full"
        />
      )}
    </>
  );
});
