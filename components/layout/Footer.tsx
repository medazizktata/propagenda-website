import { AppLink } from '@/components/ui/Link';
import { RunningMarquee } from '@/components/molecules/RunningMarquee';
import { SocialIconLink } from '@/components/molecules/SocialIconLink';
import { footer, primaryNav, socialLinks } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <RunningMarquee
        line1={footer.marquee.line1}
        line2={footer.marquee.line2}
        ctaHref={footer.marquee.ctaHref}
      />

      <div className="border-t border-white/10 px-gutter-m py-14 lg:px-gutter-d lg:py-20">
        {/* Contact + nav */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-3 lg:col-span-4">
            <a
              href={`tel:${footer.phone.replace(/\s/g, '')}`}
              className="transition-hover block text-base tracking-wide text-white/75 hover-fine:hover:text-orange md:text-lg"
            >
              {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="transition-hover block text-base tracking-wide text-white/75 hover-fine:hover:text-orange md:text-lg"
            >
              {footer.email}
            </a>
            <p className="max-w-[22ch] text-sm leading-relaxed text-white/45 md:text-base">
              {footer.address}
            </p>
          </div>

          <nav className="lg:col-span-5" aria-label="Footer">
            <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    variant="footer"
                    className="text-base font-bold tracking-wide text-white lg:text-xl"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 lg:col-span-3 lg:items-end">
            {footer.legalLinks.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                variant="footer"
                className="text-sm font-semibold tracking-wide text-white/55 lg:text-base"
              >
                {item.label}
              </AppLink>
            ))}
          </div>
        </div>

        {/* Social icons + copyright */}
        <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-1">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <SocialIconLink link={link} />
              </li>
            ))}
          </ul>
          <p className="text-xs tracking-wide text-white/40">
            © {year} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
