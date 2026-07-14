import Link from 'next/link';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { BodyText } from '@/components/ui/BodyText';
import { cn } from '@/components/ui/cn';

interface WorkCardProps {
  title: string;
  teaser: string;
  href: string;
  accent?: string;
  large?: boolean;
}

// Cinematic full-bleed tile: gradient + brand pattern panel with the title laid
// over it (SMV "FAMOUS WORK" treatment), title visible by default. A real photo
// can drop into the same panel later (replace the BrandPattern layer).
export function WorkCard({ title, teaser, href, accent, large }: WorkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-gradient-to-br p-8',
        accent ?? 'from-navy to-charcoal',
        large ? 'min-h-[440px]' : 'min-h-[340px]',
      )}
    >
      <BrandPattern
        variant="tiled"
        id={`work-${href}`}
        className="opacity-70 transition-transform duration-cinematic ease-out hover-fine:group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="relative z-content">
        <h3 className="font-sans text-display-xs font-bold uppercase tracking-display text-white">
          {title}
        </h3>
        <BodyText muted className="mt-3 max-w-md">
          {teaser}
        </BodyText>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange">
          Show me more <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
