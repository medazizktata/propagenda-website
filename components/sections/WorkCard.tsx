import Link from 'next/link';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { cn } from '@/components/ui/cn';

interface WorkCardProps {
  title: string;
  teaser: string;
  href: string;
  accent?: string;
}

export function WorkCard({ title, teaser, href, accent }: WorkCardProps) {
  return (
    <Link
      href={href}
      className="group work-card block overflow-hidden rounded-lg border border-border bg-black"
    >
      <MediaPlaceholder
        label={title}
        accent={accent}
        className={cn('work-card-image h-56 w-full transition-transform duration-cinematic ease-out hover-fine:group-hover:scale-105')}
      />
      <div className="p-6">
        <DisplayHeading as="h3" size="display-xs" className="text-lg">
          {title}
        </DisplayHeading>
        <BodyText muted className="mt-3">
          {teaser}
        </BodyText>
      </div>
    </Link>
  );
}
