import Link from 'next/link';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { cn } from '@/components/ui/cn';

export interface ServiceCardProps {
  index: number;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  subBullets?: string[];
  accent?: string;
}

const cardAccents = [
  'from-orange/30 to-navy',
  'from-navy to-charcoal',
  'from-charcoal to-orange/20',
  'from-black to-navy',
];

export function ServiceCard({
  index,
  title,
  description,
  href,
  imageSrc: _imageSrc,
  subBullets,
  accent,
}: ServiceCardProps) {
  const indexLabel = String(index).padStart(2, '0');
  const cardAccent = accent ?? cardAccents[(index - 1) % cardAccents.length];

  return (
    <article
      data-animate
      className="flex h-full flex-col overflow-hidden rounded-lg border border-white/12 bg-charcoal transition-colors duration-fast hover-fine:hover:border-orange/50"
    >
      <MediaPlaceholder label={title} accent={cardAccent} className="h-48 w-full shrink-0" />
      <div className="flex flex-1 flex-col p-6">
        <BodyText as="p" size="text-sm" muted className="font-bold uppercase tracking-wider">
          {indexLabel}
        </BodyText>
        <DisplayHeading as="h2" size="display-xs" className="mt-3 text-xl leading-snug">
          <Link href={href} className="hover-fine:hover:text-orange">
            {title}
          </Link>
        </DisplayHeading>
        <BodyText muted className="mt-4 flex-1">
          {description}
        </BodyText>
        {subBullets && subBullets.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-border pt-4">
            {subBullets.map((item) => (
              <li key={item} className="text-sm uppercase tracking-wide text-white/70">
                {item}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className={cn('mt-6 inline-block text-sm font-bold uppercase text-orange')}
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
