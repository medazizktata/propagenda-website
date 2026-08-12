import { cn } from './cn';

/** Backstage-register eyebrow: mono caps, dim — the site's second typographic voice.
    Orange is reserved for punctuation and the screen's one CTA, so labels sit quiet. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-backstage text-white/60', className)}>
      {children}
    </p>
  );
}
