'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';

interface LogoWallGridProps {
  brands: Array<{ name: string; imageSrc: string }>;
  linkable?: boolean;
}

export function LogoWallGrid({ brands, linkable = false }: LogoWallGridProps) {
  const ref = useRef<HTMLElement>(null);
  useFadeUpOnEnter(ref, '[data-logo]');

  return (
    <section ref={ref} className="border-t border-border px-gutter-m py-20 lg:px-gutter-d">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {brands.map((brand, index) => (
          <LogoCell key={brand.name} brand={brand} index={index} linkable={linkable} />
        ))}
      </div>
    </section>
  );
}

function LogoCell({
  brand,
  index,
  linkable,
}: {
  brand: { name: string; imageSrc: string };
  index: number;
  linkable: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !brand.imageSrc || imageError;

  const accents = [
    'from-navy to-charcoal',
    'from-charcoal to-black',
    'from-black to-navy',
    'from-orange/10 to-charcoal',
  ];
  const accent = accents[index % accents.length];

  const content = showPlaceholder ? (
    <MediaPlaceholder label={brand.name} accent={accent} className="h-28 w-full" />
  ) : (
    <div className="relative flex h-28 items-center justify-center bg-charcoal p-6">
      <Image
        src={brand.imageSrc}
        alt={brand.name}
        width={160}
        height={80}
        className="max-h-16 w-auto object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );

  const className =
    'overflow-hidden rounded-lg border border-border bg-black transition-opacity duration-fast hover-fine:hover:border-orange/30';

  if (linkable) {
    return (
      <a data-logo href="/contact" className={className}>
        {content}
      </a>
    );
  }

  return (
    <div data-logo className={className}>
      {content}
    </div>
  );
}
