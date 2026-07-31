'use client';

import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav, serviceNav } from '@/content/site';
import { menuOverlay, menuPanel } from '@/lib/motion/variants';
import { cn } from '@/components/ui/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <m.div
      id="mobile-menu"
      className="fixed inset-0 z-navbox md:hidden"
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={menuOverlay}
    >
      {/* Full-screen panel — no narrow column, scrolls if the list is taller than the screen. */}
      <m.nav
        ref={panelRef}
        className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-black px-gutter-m pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-height)+2.25rem)]"
        variants={menuPanel}
        aria-label="Mobile navigation"
      >
        {/* Primary nav — large, comfortably tappable. */}
        <ul className="flex flex-col">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="border-b border-white/10">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block py-4 font-sans text-2xl font-bold uppercase leading-none tracking-tight transition-colors duration-200',
                    active ? 'text-orange' : 'text-white hover-fine:hover:text-orange',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Services — compact secondary list so all seven fit without overflow or ugly wraps. */}
        <div className="mt-8">
          <p className="mb-1 font-sans text-sm font-semibold text-white/45">Services</p>
          <ul className="flex flex-col">
            {serviceNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block py-2.5 font-sans text-[0.95rem] font-medium leading-tight transition-colors duration-200',
                      active ? 'text-orange' : 'text-white/85 hover-fine:hover:text-orange',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </m.nav>
    </m.div>
  );
}
