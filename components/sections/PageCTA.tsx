import Link from 'next/link';
import { aboutContent } from '@/content/about';
import { cn } from '@/components/ui/cn';

export interface PageCTAProps {
  line1?: string;
  line2?: string;
  support?: string;
  email?: string;
  /** Outline button — defaults to contact; service tertiary CTAs override. */
  secondary?: { label: string; href: string };
  className?: string;
}

const defaults = aboutContent.closer;

/**
 * Canonical subpage closer — charcoal field, two-line headline, support line,
 * email + project pills, and a breathing orange glow behind the type.
 */
export function PageCTA({
  line1 = defaults.line1,
  line2 = defaults.line2,
  support = defaults.support,
  email = defaults.email,
  secondary = { label: 'Start a project', href: '/contact' },
  className,
}: PageCTAProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-charcoal px-gutter-m py-28 text-center lg:px-gutter-d lg:py-36',
        className,
      )}
    >
      {/* Outer wash — soft ambient fill so the pulse never reads as a hard blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] h-[min(85vw,34rem)] w-[min(110vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/40 blur-[140px] animate-cta-glow-soft motion-reduce:animate-none motion-reduce:opacity-30"
      />
      {/* Core bloom — sits behind the orange line; opacity + scale breathe. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[48%] h-[min(55vw,22rem)] w-[min(75vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange blur-[90px] animate-cta-glow motion-reduce:animate-none motion-reduce:opacity-35"
      />

      <div className="relative z-content mx-auto max-w-3xl">
        <h2
          className="font-sans font-bold leading-[1.08] tracking-[-0.025em]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
        >
          <span className="block text-white">{line1}</span>
          <span className="block text-orange">{line2}</span>
        </h2>
        {support ? (
          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/55">
            {support}
          </p>
        ) : null}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`mailto:${email}`}
            className={cn(
              'inline-flex min-h-12 items-center gap-2 rounded-full bg-orange px-8 py-3.5',
              'font-sans text-sm font-bold text-ink',
              'transition-[transform,background-color,color] duration-300 ease-out',
              'hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange',
            )}
          >
            <span aria-hidden>↗</span>
            {email}
          </Link>
          <Link
            href={secondary.href}
            className={cn(
              'inline-flex min-h-12 items-center rounded-full border border-white/20 px-8 py-3.5',
              'font-sans text-sm font-bold uppercase tracking-[0.12em] text-white',
              'transition-[transform,border-color,color] duration-300 ease-out',
              'hover-fine:hover:-translate-y-0.5 hover-fine:hover:border-orange hover-fine:hover:text-orange',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange',
            )}
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
