import { Button } from '@/components/ui/Button';

/**
 * Services page close — a bold full-bleed orange band (brand reserves orange as a surface
 * for CTAs/footers) that bookends the hero's "THE WHOLE BRAND, ONE STUDIO." Replaces the
 * generic navy CTA band.
 */
export function ServicesCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange to-orange-hover">
      <div className="relative z-content mx-auto flex max-w-4xl flex-col items-center gap-8 px-gutter-m py-20 text-center lg:px-gutter-d lg:py-24">
        <h2
          className="font-sans font-bold uppercase leading-[1] tracking-display text-navy"
          style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.5rem)' }}
        >
          Let&apos;s build it together.
        </h2>
        <Button href="/contact" variant="secondary" size="lg">
          Start a project &rarr;
        </Button>
      </div>
    </section>
  );
}
