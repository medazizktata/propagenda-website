'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/Link';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { cn } from '@/components/ui/cn';

/**
 * Enriched services menu data — label, route, a preview image (temporary portfolio maps until
 * real service assets land) and a one-line pitch. Drives the mega-menu preview pane.
 */
const SERVICE_MENU = [
  {
    label: 'Branding & Visual Identity',
    href: '/services/branding-visual-identity',
    image: '/images/portfolio/work-sanapex.png',
    blurb: 'Logos, identity systems, and guidelines that make you unmistakable.',
  },
  {
    label: 'Public Relations',
    href: '/services/public-relations',
    image: '/images/portfolio/work-ghaftree.png',
    blurb: 'Influencers, media, and celebrity reach that get you noticed.',
  },
  {
    label: 'Online & Offline Marketing',
    href: '/services/online-offline-marketing',
    image: '/images/portfolio/work-events.png',
    blurb: 'Full-funnel campaigns, content, and ads that grow you.',
  },
  {
    label: 'Websites',
    href: '/services/websites',
    image: '/images/portfolio/work-quickcars.png',
    blurb: 'High-performing sites and landing pages, concept to launch.',
  },
  {
    label: 'Mobile Applications',
    href: '/services/mobile-applications',
    image: '/images/portfolio/work-food.png',
    blurb: 'Native-feeling iOS & Android apps, first sketch to store.',
  },
  {
    label: 'Events',
    href: '/services/events',
    image: '/images/portfolio/work-events.png',
    blurb: 'End-to-end event branding, production, and coverage.',
  },
  {
    label: 'Photography & Videography',
    href: '/services/photography-videography',
    image: '/images/portfolio/work-food.png',
    blurb: 'Product, lifestyle, and cinematic video that sells.',
  },
] as const;

/** Line icon per service (stroke, currentColor). Slug = last path segment. */
function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
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
  switch (slug) {
    case 'branding-visual-identity':
      return (
        <svg {...common}>
          <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <circle cx="17.5" cy="17.5" r="3.5" />
        </svg>
      );
    case 'public-relations':
      return (
        <svg {...common}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case 'online-offline-marketing':
      return (
        <svg {...common}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'websites':
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'mobile-applications':
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case 'events':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'photography-videography':
      return (
        <svg {...common}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Desktop "Services" nav item → a two-pane mega-menu. Hover/focus a service on the left (icon +
 * label, smooth slide toward the preview) and the right pane previews it full-bleed. Reveal is
 * CSS (group-hover + focus-within). Desktop only — the mobile menu already lists services.
 */
export function ServicesNavMenu() {
  const pathname = usePathname();
  const onServices = pathname === '/services' || pathname.startsWith('/services/');
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstPath = useRef(true);

  const currentIndex = SERVICE_MENU.findIndex((s) => s.href === pathname);
  const [active, setActive] = useState(currentIndex >= 0 ? currentIndex : 0);
  const [menuSuppressed, setMenuSuppressed] = useState(false);
  const preview = SERVICE_MENU[active];

  useEffect(() => {
    setActive(currentIndex >= 0 ? currentIndex : 0);
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    setMenuSuppressed(true);
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && rootRef.current?.contains(focused)) {
      focused.blur();
    }
  }, [pathname, currentIndex]);

  const dismissMenu = () => setMenuSuppressed(true);

  return (
    <div
      ref={rootRef}
      className="group relative"
      onMouseLeave={() => setMenuSuppressed(false)}
    >
      <AppLink
        href="/services"
        variant="nav"
        active={onServices}
        className="flex items-center gap-1 px-1.5 py-1 text-[0.7rem] font-semibold tracking-[0.14em]"
      >
        Services
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AppLink>

      {/* Mega-menu — hidden until the group is hovered or focused within. */}
      <div
        className={cn(
          'invisible absolute left-1/2 top-full z-header -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-200 ease-out',
          !menuSuppressed &&
            'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 focus-within:visible focus-within:translate-y-0 focus-within:opacity-100',
        )}
      >
        <div className="relative w-[46rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/12 bg-charcoal/95 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]">
            <BrandPattern variant="tiled" />
          </div>

          <div className="relative grid grid-cols-[1.05fr_0.95fr]">
            {/* ── List ── */}
            <div className="border-r border-white/10 p-3">
              <div className="mb-2 flex items-baseline justify-between px-3">
                <span className="text-xs text-white/45">Our services</span>
                <Link
                  href="/services"
                  onClick={dismissMenu}
                  className="text-xs font-medium text-orange/90 no-underline transition-colors hover-fine:hover:text-orange"
                >
                  View all
                </Link>
              </div>
              <ul className="flex flex-col">
                {SERVICE_MENU.map((s, i) => {
                  const isCurrent = pathname === s.href;
                  const isPreview = active === i;
                  const slug = s.href.split('/').pop() ?? '';
                  return (
                    <li key={s.href} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                      <Link
                        href={s.href}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={dismissMenu}
                        className={cn(
                          'flex items-center gap-3 border-l-2 py-3 pl-[calc(0.75rem-2px)] pr-3 no-underline transition-[transform,background-color] duration-300 ease-out',
                          isCurrent
                            ? 'border-orange bg-white/[0.06]'
                            : 'border-transparent',
                          isPreview && !isCurrent ? 'translate-x-1.5' : 'translate-x-0',
                        )}
                      >
                        <ServiceIcon
                          slug={slug}
                          className={cn(
                            'h-[1.15rem] w-[1.15rem] shrink-0 transition-colors duration-300 ease-out',
                            isCurrent || isPreview ? 'text-orange' : 'text-white/40',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[0.9rem] leading-tight transition-colors duration-300 ease-out',
                            isCurrent || isPreview
                              ? 'font-semibold text-orange'
                              : 'font-medium text-white/70',
                          )}
                        >
                          {s.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── Preview pane — full-bleed image, content overlaid at the foot ── */}
            <Link
              href={preview.href}
              onClick={dismissMenu}
              className="group/pv relative flex flex-col justify-end overflow-hidden no-underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active}
                src={preview.image}
                alt=""
                className="absolute inset-0 h-full w-full animate-[tier-rise_360ms_ease-out_both] object-cover transition-transform duration-700 ease-out group-hover/pv:scale-[1.04]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/10" />
              <div key={`t-${active}`} className="relative z-10 animate-[tier-rise_360ms_ease-out_both] p-6">
                <span className="block font-sans text-lg font-semibold leading-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.85)]">
                  {preview.label}
                </span>
                <p className="mt-2 max-w-[28ch] text-[0.82rem] leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
                  {preview.blurb}
                </p>
                <span className="mt-4 inline-block text-[0.82rem] font-medium text-orange transition-transform duration-300 ease-out group-hover/pv:translate-x-1">
                  Explore this service
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
