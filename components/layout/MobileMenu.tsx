'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav, serviceNav } from '@/content/site';
import { menuOverlay, menuPanel } from '@/lib/motion/variants';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { Logo } from '@/components/ui/Logo';
import { HeaderCTA } from '@/components/molecules/HeaderCTA';
import { cn } from '@/components/ui/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

// Giant editorial nav type. Poppins (never swapped) is pushed into a dense, leaning grotesque
// via skew + horizontal condense + heaviest weight + tight tracking.
const LABEL_BASE =
  'block origin-left whitespace-nowrap font-sans font-extrabold uppercase ' +
  'tracking-[-0.02em] text-[clamp(3.4rem,18.5vw,7.5rem)] transition-transform duration-300';
// Tight, slightly overlapping leading (Tailwind v4 pairs a default line-height with text-[...],
// so we pin it inline to guarantee it wins).
const LABEL_STYLE: CSSProperties = { lineHeight: 0.78 };
const T_REST = '[transform:skewX(-8deg)_scaleX(0.9)]';
const T_HOVER = 'hover-fine:group-hover:[transform:skewX(-8deg)_scaleX(0.9)_scale(1.03)]';
const T_ACTIVE = '[transform:skewX(-8deg)_scaleX(0.9)_scale(1.06)]';
const ROLL_MOTION =
  'transition-transform duration-[520ms] ease-[cubic-bezier(0.76,0,0.24,1)] ' +
  'will-change-transform hover-fine:group-hover:-translate-y-full motion-reduce:transition-none';

// Cuberto-style "tricks" hover: each glyph is two stacked copies inside an overflow-clipped box.
// On hover the pair rolls up one line — the dark original leaves, a solid copy arrives — staggered
// left-to-right for the signature wave. Touch devices never hover, so they just see the base color.
function RollLabel({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <span className="block" style={style} aria-hidden>
      {Array.from(text).map((ch, i) => {
        const delay = { transitionDelay: `${i * 0.03}s` } as CSSProperties;
        return (
          <span key={i} className="relative inline-block overflow-hidden align-top">
            <span className={cn('block', ROLL_MOTION)} style={delay}>
              {ch}
            </span>
            <span className={cn('absolute left-0 top-full block text-white', ROLL_MOTION)} style={delay}>
              {ch}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith('/services'));

  // Latest onClose, updated in an effect (never during render).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap — body scroll is locked while the overlay is up, so Tab must
      // cycle inside the panel instead of walking into the page behind it.
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        ).filter((n) => n.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (current === first || !panelRef.current.contains(current))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (current === last || !panelRef.current.contains(current))) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    const first =
      panelRef.current?.querySelector<HTMLElement>('[data-menu-focus]') ??
      panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  // Close on any client navigation (covers the logo + Contact pill, which have no explicit onClick).
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const listVariants: Variants = {
    closed: {},
    open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = reduced
    ? { closed: { opacity: 1, x: 0 }, open: { opacity: 1, x: 0 } }
    : {
        closed: { opacity: 0, x: -26 },
        open: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        },
      };

  // Selected page = solid orange; everything else = dark-gray fill that rolls to white on hover.
  const labelClass = (active: boolean) =>
    cn(LABEL_BASE, active ? cn('text-orange', T_ACTIVE) : cn('text-white/[0.22]', T_REST, T_HOVER));

  return (
    <m.div
      id="mobile-menu"
      className="fixed inset-0 z-navbox lg:hidden"
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={menuOverlay}
    >
      <m.nav
        ref={panelRef}
        className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-black"
        variants={menuPanel}
        aria-label="Mobile navigation"
      >
        {/* Faint orange brand pattern bleeding off the right edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 -z-0 w-[70%] max-w-[500px] overflow-hidden"
        >
          <BrandPattern variant="dense" half="right" className="opacity-[0.22]" />
        </div>

        <div className="relative z-[1] flex min-h-full flex-col pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          {/* Same chrome as Header — pt-3 outside the h-11 row, mark left, CTA + control gap-3. */}
          <div className="shrink-0 pt-3">
            <div className="mx-auto flex h-11 max-w-[1920px] items-center justify-between px-gutter-m">
              <Logo variant="mark" />
              <div className="flex items-center gap-3">
                <HeaderCTA />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-white transition-hover hover-fine:hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
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
          </div>

          {/* Giant primary stack. */}
          <m.ul variants={listVariants} className="mt-[12vh] flex flex-col pl-gutter-m pr-4">
            {primaryNav.map((navItem, i) => {
              const active = isActive(navItem.href);
              const isServices = navItem.href === '/services';

              if (isServices) {
                return (
                  <m.li key={navItem.href} variants={itemVariants} className={cn('relative', active && 'z-10')}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      aria-controls="mobile-services-panel"
                      data-menu-focus={i === 0 ? '' : undefined}
                      className="group relative block w-full rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                    >
                      <span className={labelClass(active)} style={LABEL_STYLE}>
                        <RollLabel text={navItem.label} style={LABEL_STYLE} />
                      </span>
                      <svg
                        className={cn(
                          'absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-orange transition-transform duration-300',
                          servicesOpen && 'rotate-180',
                        )}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    <AnimatePresence initial={false}>
                      {servicesOpen && (
                        <m.div
                          key="svc"
                          id="mobile-services-panel"
                          role="region"
                          aria-label="Services"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
                          }
                          className="overflow-hidden"
                        >
                          <ul className="mb-3 mt-4 flex flex-col gap-y-1 pl-1">
                            {serviceNav.map((svc, si) => {
                              const sActive = pathname === svc.href;
                              return (
                                <li key={svc.href}>
                                  <Link
                                    href={svc.href}
                                    onClick={onClose}
                                    aria-current={sActive ? 'page' : undefined}
                                    className="group/svc flex items-baseline gap-3"
                                  >
                                    <span
                                      className={cn(
                                        'font-mono text-[0.7rem] font-medium tabular-nums transition-colors duration-300',
                                        sActive ? 'text-orange' : 'text-white/30 group-hover/svc:text-orange',
                                      )}
                                    >
                                      {String(si + 1).padStart(2, '0')}
                                    </span>
                                    <span
                                      className={cn(
                                        'block origin-left whitespace-nowrap font-sans text-[clamp(1.15rem,5vw,1.7rem)] font-bold leading-none tracking-[-0.01em] transition-[transform,color] duration-300 [transform:skewX(-8deg)]',
                                        sActive
                                          ? 'text-orange'
                                          : 'text-white/35 hover-fine:group-hover/svc:translate-x-1 hover-fine:group-hover/svc:text-white active:text-white',
                                      )}
                                    >
                                      {svc.label}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </m.li>
                );
              }

              return (
                <m.li key={navItem.href} variants={itemVariants} className={cn('relative', active && 'z-10')}>
                  <Link
                    href={navItem.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    data-menu-focus={i === 0 ? '' : undefined}
                    className="group block w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                  >
                    <span className={labelClass(active)} style={LABEL_STYLE}>
                      <RollLabel text={navItem.label} style={LABEL_STYLE} />
                    </span>
                  </Link>
                </m.li>
              );
            })}
          </m.ul>
        </div>
      </m.nav>
    </m.div>
  );
}
