'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { NavItemLink } from '@/components/molecules/NavItem';
import { ServicesNavMenu } from '@/components/molecules/ServicesNavMenu';
import { HeaderCTA } from '@/components/molecules/HeaderCTA';
import { HamburgerButton } from '@/components/molecules/HamburgerButton';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { primaryNav } from '@/content/site';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

/** Scroll distance (px) over which the feather veil eases in. */
const FILL_RANGE_PX = 96;
/** Only start hiding the bar once you've scrolled past it (px). */
const HIDE_AFTER_PX = 140;

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
    let lastY = window.scrollY;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const next = Math.min(1, Math.max(0, y / FILL_RANGE_PX));
      setFill((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));

      if (reducedMotion) {
        lastY = y;
      } else if (Math.abs(y - lastY) > 6) {
        // Down + past the bar → hide; any upward move → reveal.
        if (y > lastY && y > HIDE_AFTER_PX) setHidden(true);
        else if (y < lastY) setHidden(false);
        lastY = y;
      }
      if (y <= HIDE_AFTER_PX) setHidden(false); // always shown near the top
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-header bg-transparent pt-3',
        'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // will-change only while auto-hiding — otherwise it traps fixed children and
        // the mobile menu (when nested) painted under page content.
        !menuOpen && 'will-change-transform',
        menuOpen && 'z-navbox',
        // -10rem clears the 8.5rem veil too, so nothing peeks while hidden. Never hide with
        // the mobile menu open.
        hidden && !menuOpen && '-translate-y-[10rem]',
      )}
    >
      {/* Veil — solid through the nav row (nothing may ghost behind the links), then feathers. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[8.5rem] bg-gradient-to-b from-charcoal from-45% via-charcoal/85 via-65% to-transparent transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: menuOpen || veilOff ? 0 : fill }}
      />
      {/* Chrome sits above the full-screen menu — only the hamburger morphs to ×. */}
      <div className="relative z-20 mx-auto flex h-11 max-w-[1920px] items-center justify-between px-gutter-m lg:px-gutter-d">
        <Logo variant="mark" className="lg:hidden" />
        <Logo className="hidden lg:inline-flex" />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {primaryNav.map((item) =>
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
