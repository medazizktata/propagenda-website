import type { ReactNode } from 'react';
import { AppLink } from '@/components/ui/Link';

export function MarqueeWord({ children }: { children: React.ReactNode }) {
  return <span className="mx-4 whitespace-nowrap font-bold uppercase tracking-wider">{children}</span>;
}

interface RunningMarqueeProps {
  line1: string;
  line2: string;
  ctaHref: string;
}

export function RunningMarquee({ line1, line2, ctaHref }: RunningMarqueeProps) {
  const content = (
    <>
      <MarqueeWord>{line1}</MarqueeWord>
      <MarqueeWord>
        <AppLink href={ctaHref} variant="ghost">
          {line2}
        </AppLink>
      </MarqueeWord>
    </>
  );

  return (
    <div className="overflow-hidden border-b border-border bg-black py-4">
      <div className="flex w-max animate-[marquee_30s_linear_infinite]">
        {content}
        {content}
      </div>
    </div>
  );
}
