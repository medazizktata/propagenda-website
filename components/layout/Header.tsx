'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { NavItemLink } from '@/components/molecules/NavItem';
import { ServicesNavMenu } from '@/components/molecules/ServicesNavMenu';
import { HeaderCTA } from '@/components/molecules/HeaderCTA';
import { HamburgerButton } from '@/components/molecules/HamburgerButton';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { getPrimaryNavigation } from '@/lib/content/navigation';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

/** Scroll distance (px) over which the feather veil eases in. */
const FILL_RANGE_PX = 96;
/** Only start hiding the bar once you've scrolled past it (px). */
const HIDE_AFTER_PX = 140;
/** Min scroll delta (px) before toggling auto-hide — avoids Lenis scrub jitter. */
const SCROLL_DIR_THRESHOLD_PX = 10;

function getScrollY() {
  return window.__lenis?.scroll ?? window.scrollY;
}

export function Header() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fill, setFill] = useState(0);
  // Auto-hide: the bar retracts up when you scroll down, and drops back in the moment you
  // scroll up — so the content gets the screen while you read, the nav is a flick away.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastY = getScrollY();
    let lenisCleanup: (() => void) | undefined;

    const update = () => {
      raf = 0;
      const y = getScrollY();
      const nextFill = Math.min(1, Math.max(0, y / FILL_RANGE_PX));
      setFill((prev) => (Math.abs(prev - nextFill) < 0.008 ? prev : nextFill));

      if (reducedMotion) {
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (y <= HIDE_AFTER_PX) {
        setHidden(false);
      } else if (delta > SCROLL_DIR_THRESHOLD_PX) {
        setHidden(true);
      } else if (delta < -SCROLL_DIR_THRESHOLD_PX) {
        setHidden(false);
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const attachLenis = () => {
      const lenis = window.__lenis;
      if (!lenis || lenisCleanup) return;
      lenis.on('scroll', onScroll);
      lenisCleanup = () => lenis.off('scroll', onScroll);
    };

    update();
    attachLenis();
    window.addEventListener('scroll', onScroll, { passive: true });

    const lenisPoll = window.setInterval(() => {
      attachLenis();
      if (lenisCleanup) window.clearInterval(lenisPoll);
    }, 50);

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenisCleanup?.();
      window.clearInterval(lenisPoll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, reducedMotion]);

  // Sections (e.g. work-split pin) can suppress the charcoal veil via this attr.
  const [veilOff, setVeilOff] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setVeilOff(root.hasAttribute('data-header-veil-off'));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-header-veil-off'] });
    return () => mo.disconnect();
  }, []);

  const veilVisible = !menuOpen && !veilOff && !hidden;
  const veilOpacity = veilVisible ? fill : 0;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-header bg-transparent pt-3',
        'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transform-gpu',
        !menuOpen && 'will-change-transform',
        menuOpen && 'z-navbox',
        hidden && !menuOpen && '-translate-y-[10rem]',
      )}
    >
      {/* Veil — solid through the nav row, then feathers. Fades with the bar on hide. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[8.5rem]',
          'bg-gradient-to-b from-charcoal from-45% via-charcoal/85 via-65% to-transparent',
          'transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transform-gpu',
          veilVisible && fill > 0.02 && 'will-change-[opacity]',
        )}
        style={{ opacity: veilOpacity }}
      />
      {/* Chrome sits above the full-screen menu — only the hamburger morphs to ×. */}
      <div className="relative z-20 mx-auto flex h-11 max-w-[1920px] items-center justify-between px-gutter-m lg:px-gutter-d">
        <Logo variant="mark" className="lg:hidden" />
        <Logo className="hidden lg:inline-flex" />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {getPrimaryNavigation().map((item) =>
            item.href === '/services' ? (
              <ServicesNavMenu key={item.href} />
            ) : (
              <NavItemLink key={item.href} item={item} />
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <HeaderCTA />
          <HamburgerButton open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
