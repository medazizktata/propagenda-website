'use client';

import type { ReactNode } from 'react';
import { InitLoader } from '@/components/layout/InitLoader';
import { PageTransitionLoader } from '@/components/layout/PageTransitionLoader';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { registerGsap, ScrollTrigger } from '@/lib/motion/gsap';
import { setViewportHeight } from '@/lib/utils/vh';
import { useEffect } from 'react';

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    // Late-loading content — web fonts, the hero video, images — reflows the page AFTER
    // GSAP has measured its pinned/scrubbed triggers, stranding them at stale start/end
    // positions (broken first scroll into a section, sections not resetting on scroll-back).
    // Recompute once things settle, and again after the intro loader's window.
    const refresh = () => ScrollTrigger.refresh();
    const timers = [
      window.setTimeout(refresh, 400),
      window.setTimeout(refresh, 1400),
      window.setTimeout(refresh, 2600),
    ];
    window.addEventListener('load', refresh);
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('load', refresh);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <>
      <InitLoader />
      <PageTransitionLoader />
      <Header />
      {children}
      <Footer />
    </>
  );
}
