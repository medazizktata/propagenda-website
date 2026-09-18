'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/Link';
import { cn } from '@/components/ui/cn';

/**
 * The two halves of the portfolio — same enriched-menu pattern as ServicesNavMenu
 * (label, route, preview image, one-line pitch) driving the same mega-menu shape.
 */
const WORK_MENU = [
  {
    label: 'Design',
    href: '/work',
    image: '/images/portfolio/work-sanapex.webp',
    blurb: 'Branding and identity case studies, real client work start to finish.',
  },
  {
    label: 'Video Work',
    href: '/work/video',
    image: '/images/portfolio/work-events.webp',
    blurb: 'The showreel and video projects — motion, edits, and production work.',
  },
] as const;

function WorkMenuIcon({ slug, className }: { slug: string; className?: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };
  if (slug === 'video') {
    return (
      <svg {...common}>
        <rect x="2" y="5" width="15" height="14" rx="2" />
        <path d="m22 8-5 4 5 4V8z" />
      </svg>
    );
  }
  // Design (default)
  return (
    <svg {...common}>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

/**
 * Desktop "Work" nav item → the same two-pane mega-menu as Services, sized for the
 * portfolio's two halves (Design / Video Work) instead of seven services. Hover/focus an
 * option on the left, the right pane crossfades its preview. Desktop only.
 */
export function WorkNavMenu() {
  const pathname = usePathname();
  const onWork = pathname === '/work' || pathname.startsWith('/work/');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstPath = useRef(true);

  const currentIndex = WORK_MENU.findIndex(
    (w) => pathname === w.href || (w.href !== '/work' && pathname.startsWith(w.href)),
  );
  const [active, setActive] = useState(currentIndex >= 0 ? currentIndex : 0);
  const [menuSuppressed, setMenuSuppressed] = useState(false);
  const preview = WORK_MENU[active];

  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hl, setHl] = useState({ y: 0, h: 0, ready: false });
  useEffect(() => {
    const el = liRefs.current[active];
    if (el) setHl({ y: el.offsetTop, h: el.offsetHeight, ready: true });
  }, [active]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(currentIndex >= 0 ? currentIndex : 0);
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    const overPanel = panelRef.current?.matches(':hover') ?? false;
    setMenuSuppressed(overPanel);
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && rootRef.current?.contains(focused)) {
      focused.blur();
    }
  }, [pathname, currentIndex]);

  const dismissMenu = () => setMenuSuppressed(true);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuSuppressed(true);
      const trigger = rootRef.current?.querySelector<HTMLElement>('a[href="/work"]');
      trigger?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className="group relative"
      onMouseEnter={() => setMenuSuppressed(false)}
      onMouseLeave={() => setMenuSuppressed(false)}
      onKeyDown={onKeyDown}
    >
      <AppLink
        href="/work"
        variant="nav"
        active={onWork}
        aria-haspopup="menu"
        className="flex items-center gap-1 px-1.5 py-1 text-[0.7rem] font-semibold tracking-[0.14em]"
      >
        Work
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AppLink>

      <div
        ref={panelRef}
        className={cn(
          'invisible absolute left-1/2 top-full z-header -translate-x-1/2 translate-y-3 pt-4 opacity-0',
          'transition-[opacity,transform,visibility] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          !menuSuppressed &&
            'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 focus-within:visible focus-within:translate-y-0 focus-within:opacity-100',
        )}
      >
        <div className="relative w-[34rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/12 bg-charcoal/95 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="relative grid grid-cols-[1.05fr_0.95fr]">
            <div className="border-r border-white/10 p-3">
              <div className="mb-2 flex items-baseline justify-between px-3">
                <span className="text-xs text-white/45">Our work</span>
                <Link
                  href="/work"
                  onClick={dismissMenu}
                  className="text-xs font-medium text-orange/90 no-underline transition-colors duration-300 hover-fine:hover:text-orange"
                >
                  View all
                </Link>
              </div>
              <ul className="relative flex flex-col">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 z-0 border-l-2 border-orange bg-white/[0.06] transition-[transform,height,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: `translateY(${hl.y}px)`,
                    height: hl.h,
                    opacity: hl.ready ? 1 : 0,
                  }}
                />
                {WORK_MENU.map((w, i) => {
                  const isCurrent = pathname === w.href;
                  const isPreview = active === i;
                  const slug = w.label === 'Video Work' ? 'video' : 'design';
                  return (
                    <li
                      key={w.href}
                      ref={(el) => {
                        liRefs.current[i] = el;
                      }}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                    >
                      <Link
                        href={w.href}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={dismissMenu}
                        className={cn(
                          'relative z-[1] flex items-center gap-3 border-l-2 border-transparent py-3 pl-[calc(0.75rem-2px)] pr-3 no-underline',
                          'transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                          isPreview && !isCurrent ? 'translate-x-1.5' : 'translate-x-0',
                        )}
                      >
                        <WorkMenuIcon
                          slug={slug}
                          className={cn(
                            'h-[1.15rem] w-[1.15rem] shrink-0 transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isCurrent || isPreview ? 'text-orange' : 'text-white/40',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[0.9rem] leading-tight transition-[color,font-weight] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isCurrent || isPreview
                              ? 'font-semibold text-orange'
                              : 'font-medium text-white/70',
                          )}
                        >
                          {w.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link
              href={preview.href}
              onClick={dismissMenu}
              className="group/pv relative flex min-h-[16rem] flex-col justify-end overflow-hidden no-underline"
            >
              {WORK_MENU.map((w, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={w.href}
                  src={w.image}
                  alt=""
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover',
                    'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'group-hover/pv:scale-[1.03]',
                    active === i ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
                  )}
                />
              ))}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/10"
              />
              <div className="relative z-10 p-6">
                {WORK_MENU.map((w, i) => (
                  <div
                    key={w.href}
                    className={cn(
                      'transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                      active === i
                        ? 'relative translate-y-0 opacity-100'
                        : 'pointer-events-none absolute inset-x-6 bottom-6 translate-y-1.5 opacity-0',
                    )}
                    aria-hidden={active !== i}
                  >
                    <span className="block font-sans text-lg font-semibold leading-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.85)]">
                      {w.label}
                    </span>
                    <p className="mt-2 max-w-[28ch] text-[0.82rem] leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
                      {w.blurb}
                    </p>
                    <span className="mt-4 inline-block text-[0.82rem] font-medium text-orange transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pv:translate-x-1">
                      {w.label === 'Video Work' ? 'Watch the showreel' : 'See the case studies'}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
