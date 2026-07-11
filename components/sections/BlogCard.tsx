import Link from 'next/link';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';

interface BlogCardProps {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}

export function BlogCard({ title, date, excerpt, href }: BlogCardProps) {
  return (
    <article
      data-animate
      className="rounded-lg border border-border bg-navy/50 p-6 transition-transform duration-fast hover-fine:hover:-translate-y-1"
    >
      <BodyText as="p" size="text-sm" muted>
        {date}
      </BodyText>
      <DisplayHeading as="h3" size="display-xs" className="mt-3 text-xl leading-snug">
        <Link href={href} className="hover-fine:hover:text-orange">
          {title}
        </Link>
      </DisplayHeading>
      <BodyText muted className="mt-4">
        {excerpt}
      </BodyText>
      <Link href={href} className="mt-6 inline-block text-sm font-bold uppercase text-orange">
        Read More
      </Link>
    </article>
  );
}
