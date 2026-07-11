import type { BlogPostRecord } from '@/types/content';

function post(
  slug: BlogPostRecord['slug'],
  title: string,
  date: string,
  category: string,
  excerpt: string,
  description: string,
): BlogPostRecord {
  return {
    slug,
    title,
    date,
    category,
    excerpt,
    body: `${title} — full article content from CONTENT.md.`,
    tags: [category],
    seo: { title: `${title} | Propagenda`, description },
  };
}

export const thePowerOfVisualIdentity = post(
  'the-power-of-visual-identity',
  'The Power of Visual Identity: Why Your Brand Needs More Than Just a Logo',
  '2025-01-02',
  'Branding',
  'Why visual identity matters beyond the logo.',
  'Why visual identity matters beyond the logo — and how Propagenda builds memorable brands.',
);

export const whatsDestroyingYourBrand = post(
  'whats-destroying-your-brand',
  "What's Destroying Your Brand?",
  '2025-01-15',
  'Branding',
  'Seven brand pitfalls that erode trust.',
  'Seven brand pitfalls that erode trust — and how to protect your reputation.',
);

export const howColorsInfluenceConsumerBehavior = post(
  'how-colors-influence-consumer-behavior',
  'How Colors Influence Consumer Behavior',
  '2025-02-01',
  'Design',
  'Color psychology for marketing.',
  'Color psychology for marketing — emotional impact and brand color selection tips.',
);

export const allBlogPosts: BlogPostRecord[] = [
  thePowerOfVisualIdentity,
  whatsDestroyingYourBrand,
  howColorsInfluenceConsumerBehavior,
];

export const blogPostsBySlug = Object.fromEntries(
  allBlogPosts.map((p) => [p.slug, p]),
) as Record<BlogPostRecord['slug'], BlogPostRecord>;
