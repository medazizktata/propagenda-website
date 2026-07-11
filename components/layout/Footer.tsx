import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
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
      <div className="px-gutter-m py-16 lg:px-gutter-d">
        <DisplayHeading as="p" size="display-xs" className="mb-8">
          {footer.tagline}
        </DisplayHeading>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <BodyText muted>
              <a href={`tel:${footer.phone.replace(/\s/g, '')}`} className="hover-fine:hover:text-orange">
                {footer.phone}
              </a>
            </BodyText>
            <BodyText muted>
              <a href={`mailto:${footer.email}`} className="hover-fine:hover:text-orange">
                {footer.email}
              </a>
            </BodyText>
            <BodyText muted>{footer.address}</BodyText>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer">
            {primaryNav.map((item) => (
              <AppLink key={item.href} href={item.href} variant="footer">
                {item.label}
              </AppLink>
            ))}
          </nav>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <SocialIconLink key={link.platform} link={link} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {footer.legalLinks.map((item) => (
              <AppLink key={item.href} href={item.href} variant="footer">
                {item.label}
              </AppLink>
            ))}
          </div>
        </div>
        <BodyText as="p" size="text-sm" muted className="mt-12">
          © {year} {footer.copyright}
        </BodyText>
      </div>
    </footer>
  );
}
