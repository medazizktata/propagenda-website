import { blogPostsBySlug } from '@/content/blog';
import type { BlogPostRecord, BlogSlug } from '@/types/content';

export function getBlogPost(slug: BlogSlug): BlogPostRecord | undefined {
  return blogPostsBySlug[slug];
}

export function getAllBlogPosts(): BlogPostRecord[] {
  return Object.values(blogPostsBySlug);
}
