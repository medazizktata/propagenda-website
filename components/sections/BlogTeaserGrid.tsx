'use client';

import { useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { BlogCard } from '@/components/sections/BlogCard';
import { blogTeasers } from '@/content/home';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';

export function BlogTeaserGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeUpOnEnter(sectionRef);

  return (
    <section ref={sectionRef} className="bg-black px-gutter-m py-32 lg:px-gutter-d">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Blog</SectionLabel>
          <DisplayHeading as="h2" size="display-xs" className="mt-2">
            Latest Insights & Inspiration
          </DisplayHeading>
        </div>
        <Button href="/blog" variant="primary-ghost">
          View All Post
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {blogTeasers.map((post) => (
          <BlogCard key={post.href} {...post} />
        ))}
      </div>
    </section>
  );
}
