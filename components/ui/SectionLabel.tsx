import { cn } from './cn';

/** Eyebrow / section-label: a short lead-in ahead of a headline, in the site's one
    display voice rather than a separate tracked-caps mono register — a small solid
    orange flag mark plus a sentence-case line. Hierarchy comes from size and weight
    against the headline that follows, not from shrinking to dim letterspaced caps.
    Orange stays reserved for this one mark and the screen's CTA. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 text-[0.95rem] font-semibold text-white/80', className)}>
      <span aria-hidden className="h-[2px] w-5 shrink-0 bg-orange" />
      {children}
    </p>
  );
}
