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
  const primaryLabel = tertiary?.label ?? 'Start a project';
  const primaryHref = tertiary?.href ?? '/contact';

  return (
    <section className="relative overflow-hidden bg-orange">
      <BrandPattern variant="tiled" className="!opacity-[0.1] [filter:brightness(0)]" />
      <div className="relative z-content mx-auto flex max-w-3xl flex-col items-center gap-7 px-gutter-m py-16 text-center lg:px-gutter-d lg:py-20">
        <h2
          className="font-sans font-bold uppercase leading-[0.95] tracking-display text-navy"
          style={{ fontSize: 'clamp(1.85rem, 4.4vw, 3.25rem)' }}
        >
          {heading}
        </h2>
        <Button href={primaryHref} variant="secondary" size="lg">
          {primaryLabel}
          {' →'}
        </Button>
      </div>
    </section>
  );
}
