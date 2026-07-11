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
    address: {
      '@type': 'PostalAddress',
      streetAddress: footer.address,
      addressLocality: 'Dubai',
      addressRegion: 'UAE',
      addressCountry: 'AE',
    },
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function localBusinessJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Propagenda Marketing Services',
    url: `${siteUrl}/contact`,
    email: footer.email,
    telephone: footer.phone.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: footer.address,
      addressLocality: 'Dubai',
      addressRegion: 'UAE',
      addressCountry: 'AE',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
  };
}
