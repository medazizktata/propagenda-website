'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { AppToastProvider } from '@/components/ui/toast';
import { CustomCursor } from '@/components/ui/CustomCursor';

// Module-level: StrictMode double-invokes effects in dev, and MSW throws an
// invariant ("cannot configure an already enabled network") on a second start.
let mswStarted = false;

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || mswStarted) return;
    mswStarted = true;

    import('@/msw/browser').then(({ worker }) => {
      worker.start({ onUnhandledRequest: 'bypass' });
    });
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <AppToastProvider>
        {children}
        <CustomCursor />
      </AppToastProvider>
    </LazyMotion>
  );
}
