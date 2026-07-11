import { notFound } from 'next/navigation';
import { StubPage } from '@/components/StubPage';
import { getBlogPost } from '@/lib/content/getBlogPost';
import { getBlogSlugs } from '@/lib/content/getAllSlugs';
import { buildMetadata } from '@/lib/seo/metadata';
import type { BlogSlug } from '@/types/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: BlogSlug }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata(post.seo, `/blog/${slug}`);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <StubPage title={post.title} description={post.excerpt} />;
}
