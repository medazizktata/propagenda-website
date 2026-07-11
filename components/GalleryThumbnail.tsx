'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { cn } from '@/components/ui/cn';

interface GalleryThumbnailProps {
  src: string;
  alt: string;
  index: number;
  onOpen?: (index: number) => void;
  overlayTitle?: string;
  accent?: string;
}

const galleryAccents = [
  'from-orange/30 to-navy',
  'from-navy to-charcoal',
  'from-charcoal to-orange/20',
  'from-black to-navy',
];

export function GalleryThumbnail({
  src,
  alt,
  index,
  onOpen,
  overlayTitle,
  accent,
}: GalleryThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !src || imageError;
  const cardAccent = accent ?? galleryAccents[index % galleryAccents.length];

  const handleOpen = () => {
    if (!showPlaceholder && onOpen) {
      onOpen(index);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={showPlaceholder}
      className={cn(
        'group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-black text-left',
        !showPlaceholder && 'cursor-zoom-in hover-fine:hover:border-orange/50',
        showPlaceholder && 'cursor-default',
      )}
      aria-label={showPlaceholder ? alt : `Open image: ${alt}`}
    >
      {showPlaceholder ? (
        <MediaPlaceholder label={overlayTitle ?? alt} accent={cardAccent} className="h-full w-full" />
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-cinematic ease-out hover-fine:group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <span className="absolute inset-0 flex items-end bg-black/0 p-4 text-sm font-bold uppercase tracking-wider transition-colors duration-fast hover-fine:group-hover:bg-black/60">
            {overlayTitle ?? alt}
          </span>
        </>
      )}
    </button>
  );
}
