'use client';

import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { NavItemLink } from '@/components/molecules/NavItem';
import { HeaderCTA } from '@/components/molecules/HeaderCTA';
import { HamburgerButton } from '@/components/molecules/HamburgerButton';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { primaryNav } from '@/content/site';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-header border-b border-border bg-charcoal/95 backdrop-blur-sm">
      <div className="mx-auto flex h-header max-w-[1920px] items-center justify-between px-gutter-m lg:px-gutter-d">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
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
