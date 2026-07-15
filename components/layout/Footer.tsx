'use client';

import { useEffect, useRef } from 'react';
import { AppLink } from '@/components/ui/Link';
import { RunningMarquee } from '@/components/molecules/RunningMarquee';
import { SocialIconLink } from '@/components/molecules/SocialIconLink';
import { ScrollToTopButton } from '@/components/molecules/ScrollToTopButton';
import { footer, primaryNav, socialLinks } from '@/content/site';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.footer-reveal');

      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 28 });

      gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          end: 'top 45%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      }).to(items, {
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        duration: 0.35,
        stagger: 0.08,
      });
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={footerRef} className="bg-black text-white">
      <div className="footer-reveal">
        <RunningMarquee
          line1={footer.marquee.line1}
          line2={footer.marquee.line2}
          ctaHref={footer.marquee.ctaHref}
        />
      </div>

      <div className="border-t border-white/10 px-gutter-m py-10 lg:px-gutter-d lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="footer-reveal space-y-2 lg:col-span-4">
            <a
              href={`tel:${footer.phone.replace(/\s/g, '')}`}
              className="transition-hover block text-sm tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="transition-hover block text-sm tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.email}
            </a>
            <p className="max-w-[22ch] text-sm leading-relaxed text-white/45">
              {footer.address}
            </p>
          </div>

          <nav className="footer-reveal lg:col-span-5" aria-label="Footer">
            <ul className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    variant="footer"
                    className="text-sm font-bold tracking-wide text-white lg:text-base"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-reveal flex flex-col gap-2 lg:col-span-3 lg:items-end">
            {footer.legalLinks.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                variant="footer"
                className="text-xs font-semibold tracking-wide text-white/55 lg:text-sm"
              >
                {item.label}
              </AppLink>
            ))}
          </div>
        </div>

        <div className="footer-reveal mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-0.5">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <SocialIconLink link={link} />
              </li>
            ))}
          </ul>
          <ScrollToTopButton />
          <p className="text-xs tracking-wide text-white/40 sm:min-w-[12rem] sm:text-right">
            © {year} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
