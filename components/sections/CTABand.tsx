import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';

interface CTABandProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tertiaryCta?: { label: string; href: string };
}

export function CTABand({
  title = 'Ready to start?',
  ctaLabel = 'Contact Us',
  ctaHref = '/contact',
  tertiaryCta,
}: CTABandProps) {
  return (
    <section className="border-t border-border bg-navy px-gutter-m py-20 text-center lg:px-gutter-d">
      <DisplayHeading as="h2" size="display-xs" className="mb-8">
        {title}
      </DisplayHeading>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button href={ctaHref} size="lg">
          {ctaLabel}
        </Button>
        {tertiaryCta && (
          <Button href={tertiaryCta.href} variant="primary-ghost" size="lg">
            {tertiaryCta.label}
          </Button>
        )}
      </div>
    </section>
  );
}
