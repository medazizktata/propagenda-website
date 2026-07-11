import type { SeoMeta } from '@/types/content';
import { getSiteUrl } from '@/lib/seo/site';

export function buildMetadata(seo: SeoMeta, path = '/') {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${path}`;

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
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: seo.title,
      description: seo.description,
    },
  };
}
