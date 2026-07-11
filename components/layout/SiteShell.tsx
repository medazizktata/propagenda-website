'use client';

import type { ReactNode } from 'react';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { InitLoader } from '@/components/layout/InitLoader';
import { PageTransitionLoader } from '@/components/layout/PageTransitionLoader';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { registerGsap } from '@/lib/motion/gsap';
import { setViewportHeight } from '@/lib/utils/vh';
import { useEffect } from 'react';

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  return (
    <>
      <GrainOverlay />
      <InitLoader />
      <PageTransitionLoader />
      <Header />
      {children}
      <Footer />
    </>
  );
}
