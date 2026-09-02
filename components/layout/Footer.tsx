'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/Link';
import { Button } from '@/components/ui/marketing-button';
import { SocialIconLink } from '@/components/molecules/SocialIconLink';
import { footer, socialLinks } from '@/content/site';
import { getLegalNavigation, getPrimaryNavigation } from '@/lib/content/navigation';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { scrollToTopSmooth } from '@/lib/motion/scrollToTop';
import { cn } from '@/components/ui/cn';

function FooterScrollTopDot({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => scrollToTopSmooth({ instant: reducedMotion })}
      aria-label="Back to top"
      title="Back to top"
      className={cn(
        'group relative ml-1.5 inline-flex h-[0.38em] min-h-[1.15rem] w-[0.38em] min-w-[1.15rem] translate-y-[0.06em] items-center justify-center rounded-full bg-orange align-middle',
        'transition-hover hover-fine:hover:bg-orange-hover hover-fine:hover:scale-110',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange/70',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-[52%] w-[52%] min-h-3 min-w-3 text-navy opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}

/** Locks child width to the measured headline — links stay within those edges. */
function FooterRail({
  width,
  className,
  children,
}: {
  width?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('mx-auto max-w-full transition-[width] duration-200', className)}
      style={width ? { width } : undefined}
    >
      {children}
    </div>
  );
}

const ROW =
  'flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8 lg:gap-x-10';

export function Footer() {
  const pathname = usePathname();
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const [headlineWidth, setHeadlineWidth] = useState<number>();
  const isAdminRoute =
    pathname?.startsWith('/admin') === true || pathname?.startsWith('/auth') === true;
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    const sync = () => setHeadlineWidth(el.offsetWidth);
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    if (document.fonts) document.fonts.ready.then(sync).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  if (isAdminRoute) return null;

  return (
    <footer className="bg-black text-white">
      <div className="flex flex-col items-center border-t border-white/10 px-gutter-m pb-10 pt-10 text-center md:pb-12 md:pt-12 lg:px-gutter-d lg:pb-14 lg:pt-16">
        <FooterRail width={headlineWidth} className="flex flex-col items-center">
          <p
            ref={headlineRef}
            className="font-sans font-extrabold uppercase leading-[0.95] text-white text-display-sm"
          >
            Looking for the
            <br />
            better future
            <FooterScrollTopDot />
          </p>

          <div className="mt-6">
            <Button href="/contact" size="lg">
              Contact us
            </Button>
          </div>

          <nav aria-label="Footer" className="mt-6 w-full md:mt-7">
            <ul className={ROW}>
              {getPrimaryNavigation().map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    variant="footer"
                    className="text-sm font-bold leading-none tracking-wide text-white lg:text-base"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="mt-4 w-full md:mt-5">
            <ul className={ROW}>
              {getLegalNavigation().map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    variant="footer"
                    className="text-xs font-semibold leading-none tracking-wide text-white/55 lg:text-sm"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 w-full border-t border-white/10 pt-4 md:mt-6 md:pt-5">
            <ul className={ROW}>
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <SocialIconLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        </FooterRail>

        <p className="mt-3 text-xs tracking-wide text-white/55 sm:mt-4">
          © {year} {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
