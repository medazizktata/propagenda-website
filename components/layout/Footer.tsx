'use client';

import { AppLink } from '@/components/ui/Link';
import { SocialIconLink } from '@/components/molecules/SocialIconLink';
import { ScrollToTopButton } from '@/components/molecules/ScrollToTopButton';
import { footer, primaryNav, socialLinks } from '@/content/site';
import { bookCall, whatsapp } from '@/content/contact';
import { WhatsAppGlyph, CalendarGlyph } from '@/components/ui/ChannelGlyphs';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* The brand's own tagline as the site's closing verdict — every page ends on voice,
          not on a link list. */}
      <div className="border-t border-white/10 px-gutter-m pt-10 md:pt-14 lg:px-gutter-d lg:pt-20">
        <p className="font-sans font-extrabold uppercase leading-[0.95] text-white text-display-sm">
          Looking for the
          <br />
          better future<span className="text-orange">.</span>
        </p>
      </div>

      <div className="px-gutter-m pb-10 pt-8 md:pb-12 md:pt-12 lg:px-gutter-d lg:pb-14 lg:pt-16">
        <div className="flex flex-col gap-7 md:gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
          <div className="space-y-2 lg:col-span-4">
            <a
              href={`tel:${footer.phone.replace(/\s/g, '')}`}
              className="transition-hover block font-mono text-sm leading-none tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="transition-hover block font-mono text-sm leading-none tracking-wide text-white/75 hover-fine:hover:text-orange md:text-base"
            >
              {footer.email}
            </a>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1">
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-backstage transition-hover inline-flex items-center gap-2 text-white/60 hover-fine:hover:text-white"
              >
                <WhatsAppGlyph />
                WhatsApp <span aria-hidden>↗</span>
              </a>
              {bookCall.url ? (
                <a
                  href={bookCall.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-backstage transition-hover inline-flex items-center gap-2 text-white/60 hover-fine:hover:text-white"
                >
                  <CalendarGlyph />
                  Book a call <span aria-hidden>↗</span>
                </a>
              ) : null}
            </div>
            <p className="max-w-[24ch] font-mono text-sm leading-relaxed text-white/60">
              {footer.address}
            </p>
          </div>

          <nav className="lg:col-span-5" aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-x-6">
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

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-3 lg:flex-col lg:items-end lg:gap-2.5">
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

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-5 sm:mt-10">
          <ul className="flex min-w-0 flex-wrap items-center gap-0.5">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <SocialIconLink link={link} />
              </li>
            ))}
          </ul>
          <ScrollToTopButton />
        </div>
        <p className="mt-4 text-xs tracking-wide text-white/55 sm:mt-5 sm:text-right">
          © {year} {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
