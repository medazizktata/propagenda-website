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
 * email + project pills, and a centered breathing glow that fades at the edges.
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
      {/* Centered radial bloom — soft falloff to transparent at the edges, pulses in place. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="aspect-square w-[min(58vw,20rem)] animate-cta-glow motion-reduce:animate-none motion-reduce:opacity-50"
          style={{
            background:
              'radial-gradient(circle at center, rgba(245,139,39,0.55) 0%, rgba(245,139,39,0.25) 32%, rgba(245,139,39,0.08) 58%, transparent 78%)',
          }}
        />
      </div>

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
