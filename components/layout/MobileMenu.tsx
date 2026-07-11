'use client';

import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { NavItemLink, ServiceNavItem } from '@/components/molecules/NavItem';
import { primaryNav, serviceNav } from '@/content/site';
import { menuOverlay, menuPanel } from '@/lib/motion/variants';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <m.div
      id="mobile-menu"
      className="fixed inset-0 z-navbox md:hidden"
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={menuOverlay}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        aria-label="Close menu"
        onClick={onClose}
      />
      <m.nav
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto bg-black px-gutter-m py-24"
        variants={menuPanel}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-2">
          {primaryNav.map((item) => (
            <NavItemLink key={item.href} item={item} />
          ))}
        </div>
        <div className="border-t border-border pt-6">
          <p className="mb-4 text-xs uppercase tracking-wider text-muted">Services</p>
          {serviceNav.map((item) => (
            <ServiceNavItem key={item.href} item={item} />
          ))}
        </div>
      </m.nav>
    </m.div>
  );
}
