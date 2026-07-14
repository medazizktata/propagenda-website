'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { NavItemLink } from '@/components/molecules/NavItem';
import { HeaderCTA } from '@/components/molecules/HeaderCTA';
import { HamburgerButton } from '@/components/molecules/HamburgerButton';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { primaryNav } from '@/content/site';

/** Scroll distance (px) over which the feather veil eases in. */
const FILL_RANGE_PX = 96;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const next = Math.min(1, Math.max(0, window.scrollY / FILL_RANGE_PX));
      setFill((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
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
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-header bg-transparent pt-3">
      {/* Soft veil — content under the bar feathers out (restored). Opacity follows scroll. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[9.5rem] bg-gradient-to-b from-charcoal from-20% via-charcoal/80 via-55% to-transparent transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: fill }}
      />
      <div className="relative mx-auto flex h-11 max-w-[1920px] items-center justify-between px-gutter-m lg:px-gutter-d">
        <Logo variant="mark" className="lg:hidden" />
        <Logo className="hidden lg:inline-flex" />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <NavItemLink key={item.href} item={item} />
          ))}
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
