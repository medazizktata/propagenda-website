import type { SeoMeta } from '@/types/content';
import { getSiteUrl } from '@/lib/seo/site';

/** Default share card — 1200×630, absolute via metadataBase. */
const DEFAULT_OG_IMAGE = {
  url: '/images/brand/og-share.jpg',
  width: 1200,
  height: 630,
  alt: 'Propagenda — where creativity meets strategy',
} as const;

export function buildMetadata(seo: SeoMeta, path = '/') {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${path}`;
  const image = seo.image
    ? {
        url: seo.image,
        width: 1200,
        height: 630,
        alt: seo.title,
      }
    : DEFAULT_OG_IMAGE;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: 'Propagenda',
      locale: 'en_AE',
      type: 'website' as const,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: seo.title,
      description: seo.description,
      images: [image.url],
    },
  };
}
