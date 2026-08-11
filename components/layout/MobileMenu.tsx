'use client';

import { useEffect, useRef } from 'react';
import { m, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav, serviceNav } from '@/content/site';
import { menuOverlay, menuPanel } from '@/lib/motion/variants';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Keep the latest onClose without re-firing the pathname effect on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    // Focus the first primary nav item on open (fall back to first focusable).
    const first =
      panelRef.current?.querySelector<HTMLElement>('[data-menu-focus]') ??
      panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  // Close on any client navigation — covers the logo + Contact pill (which have no
  // explicit onClick) so the overlay never lingers over the newly-loaded page.
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  // Staggered reveal of the giant stack, orchestrated by the panel's open/closed state.
  // Under reduced motion the items stay put and simply appear (never stranded hidden).
  const listVariants: Variants = {
    closed: {},
    open: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
  };
  const itemVariants: Variants = reduced
    ? { closed: { opacity: 1, x: 0 }, open: { opacity: 1, x: 0 } }
    : {
        closed: { opacity: 0, x: -22 },
        open: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        },
      };

  return (
    <m.div
      id="mobile-menu"
      className="fixed inset-0 z-navbox md:hidden"
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={menuOverlay}
    >
      {/* Full-screen black panel — slides in from the right, scrolls if taller than the screen. */}
      <m.nav
        ref={panelRef}
        className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-black"
        variants={menuPanel}
        aria-label="Mobile navigation"
      >
        {/* Brand pattern bleeding off the right edge (deconstructed monogram, very low opacity). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 -z-0 w-[62%] max-w-[440px] overflow-hidden"
        >
          <BrandPattern variant="dense" half="right" className="opacity-[0.11]" />
        </div>

        {/* Content sits above the pattern; min-h-full lets the services cluster pin to the bottom. */}
        <div className="relative z-[1] flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))]">
          {/* Top bar — aligned to the site header (same gutters + h-11 + pt-3). */}
          <div className="flex h-11 shrink-0 items-center justify-between px-gutter-m pt-3">
            <Logo variant="mark" />
            <div className="flex items-center gap-2.5">
              <Button
                href="/contact"
                size="sm"
                className="min-h-0 px-4 py-2 text-[0.7rem] tracking-[0.12em]"
              >
                Contact Us
              </Button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-white transition-hover hover-fine:hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Giant primary stack — left-aligned, uppercase, tightly stacked. */}
          <m.ul variants={listVariants} className="mt-9 flex flex-col px-gutter-m">
            {primaryNav.map((navItem, i) => {
              const active = isActive(navItem.href);
              return (
                <m.li key={navItem.href} variants={itemVariants}>
                  <Link
                    href={navItem.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    data-menu-focus={i === 0 ? '' : undefined}
                    className={cn(
                      'relative flex items-center gap-4 py-[0.12em] font-sans text-nav-mobile font-bold uppercase transition-colors duration-300',
                      active
                        ? 'text-white'
                        : 'text-transparent [-webkit-text-stroke:1.25px_rgba(255,255,255,0.26)] hover-fine:hover:text-white active:text-white',
                    )}
                  >
                    {i === 0 && (
                      <span
                        aria-hidden
                        className="absolute -left-[1.9rem] top-1/2 h-[3px] w-6 -translate-y-1/2 rounded-full bg-orange"
                      />
                    )}
                    <span>{navItem.label}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="mt-[0.14em] h-3.5 w-3.5 shrink-0 self-start rounded-full bg-orange"
                      />
                    )}
                  </Link>
                </m.li>
              );
            })}
          </m.ul>

          {/* Services — quieter secondary cluster, pinned toward the bottom. Single column so the
              longer labels never wrap or clip. */}
          <div className="mt-auto shrink-0 px-gutter-m pt-12">
            <p className="mb-3 font-sans text-2xs font-semibold uppercase tracking-label text-orange/80">
              Services
            </p>
            <ul className="flex flex-col">
              {serviceNav.map((svc) => {
                const active = pathname === svc.href;
                return (
                  <li key={svc.href}>
                    <Link
                      href={svc.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block py-1.5 font-sans text-sm font-medium transition-colors duration-300',
                        active
                          ? 'text-orange'
                          : 'text-white/45 hover-fine:hover:text-white active:text-white',
                      )}
                    >
                      {svc.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </m.nav>
    </m.div>
  );
}
