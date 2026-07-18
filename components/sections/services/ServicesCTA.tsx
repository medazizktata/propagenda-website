import { Button } from '@/components/ui/Button';
import { BrandPattern } from '@/components/ui/BrandPattern';

interface ServicesCTAProps {
  /** Headline override (defaults to the hub bookend). */
  heading?: string;
  /** Optional secondary link (e.g. a service's tertiary CTA — "Book your shoot"). */
  tertiary?: { label: string; href: string };
}

/**
 * Bold full-bleed orange close (brand reserves orange as a surface for CTAs/footers).
 * Used on the services hub (bookends "THE WHOLE BRAND, ONE STUDIO.") and reused on each
 * service detail page with a service-specific heading + optional tertiary link.
 */
export function ServicesCTA({ heading = "Let's build it together.", tertiary }: ServicesCTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange to-orange-hover">
      {/* Black monogram pattern over the orange surface. */}
      <BrandPattern variant="tiled" className="!opacity-[0.12] [filter:brightness(0)]" />
      <div className="relative z-content mx-auto flex max-w-4xl flex-col items-center gap-8 px-gutter-m py-20 text-center lg:px-gutter-d lg:py-24">
        <h2
          className="font-sans font-bold uppercase leading-[1] tracking-display text-navy"
          style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.5rem)' }}
        >
          {heading}
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Button href="/contact" variant="secondary" size="lg">
            Start a project &rarr;
          </Button>
          {tertiary && (
            <a
              href={tertiary.href}
              className="text-sm font-semibold uppercase tracking-wider text-navy underline decoration-navy/40 underline-offset-4 transition-hover hover-fine:hover:decoration-navy"
            >
              {tertiary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
