import { footer, socialLinks } from '@/content/site';
import { getSiteUrl } from '@/lib/seo/site';

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Propagenda Marketing Services',
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo.png`,
    email: footer.email,
    telephone: footer.phone.replace(/\s/g, ''),
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function localBusinessJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Propagenda Marketing Services',
    url: `${siteUrl}/contact`,
    email: footer.email,
    telephone: footer.phone.replace(/\s/g, ''),
  };
}
