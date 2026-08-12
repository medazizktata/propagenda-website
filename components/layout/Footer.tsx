'use client';

import { AppLink } from '@/components/ui/Link';
import { SocialIconLink } from '@/components/molecules/SocialIconLink';
import { ScrollToTopButton } from '@/components/molecules/ScrollToTopButton';
import { footer, primaryNav, socialLinks } from '@/content/site';
import { whatsapp } from '@/content/contact';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* The brand's own tagline as the site's closing verdict — every page ends on voice,
          not on a link list. */}
      <div className="border-t border-white/10 px-gutter-m pt-14 lg:px-gutter-d lg:pt-20">
        <p className="font-sans font-extrabold uppercase leading-[0.95] text-white text-display-sm">
          Looking for the
          <br />
          better future<span className="text-orange">.</span>
        </p>
      </div>

      <div className="px-gutter-m pb-12 pt-12 lg:px-gutter-d lg:pb-14 lg:pt-16">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-2 lg:col-span-4">
            <a
              href={`tel:${footer.phone.replace(/\s/g, '')}`}
              className="transition-hover block text-sm leading-none tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="transition-hover block text-sm leading-none tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.email}
            </a>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-backstage transition-hover inline-flex items-center gap-2 pt-1 text-white/60 hover-fine:hover:text-white"
            >
              WhatsApp <span aria-hidden>↗</span>
            </a>
            <p className="max-w-[22ch] text-sm leading-relaxed text-white/45">
              {footer.address}
            </p>
          </div>

          <nav className="lg:col-span-5" aria-label="Footer">
            <ul className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              {primaryNav.map((item) => (
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

          <div className="flex flex-col gap-2.5 lg:col-span-3 lg:items-end">
            {footer.legalLinks.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                variant="footer"
                className="text-xs font-semibold leading-none tracking-wide text-white/55 lg:text-sm"
              >
                {item.label}
              </AppLink>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
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
