import type { MetadataRoute } from 'next';
import { BLOG_SLUGS, SERVICE_SLUGS, WORK_SLUGS } from '@/lib/constants/routes';
import { getSiteUrl } from '@/lib/seo/site';

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry['changeFrequency'] = 'monthly',
): SitemapEntry {
  return {
    url: `${getSiteUrl()}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry('/', 1.0, 'weekly'),
    entry('/services', 0.9, 'weekly'),
    entry('/work', 0.9, 'weekly'),
    entry('/contact', 0.9, 'monthly'),
    entry('/about', 0.8, 'monthly'),
    ...SERVICE_SLUGS.map((slug) => entry(`/services/${slug}`, 0.8)),
    ...WORK_SLUGS.map((slug) => entry(`/work/${slug}`, 0.8)),
    entry('/blog', 0.7, 'weekly'),
    ...BLOG_SLUGS.map((slug) => entry(`/blog/${slug}`, 0.7)),
    entry('/privacy', 0.3, 'yearly'),
    entry('/terms', 0.3, 'yearly'),
    entry('/imprint', 0.3, 'yearly'),
  ];
}
