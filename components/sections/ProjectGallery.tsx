'use client';

import { GalleryThumbnail } from '@/components/GalleryThumbnail';
import { PhotoSwipeLightbox } from '@/components/PhotoSwipeLightbox';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';
import type { GalleryImage } from '@/types/content';

interface ProjectGalleryProps {
  images: GalleryImage[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const { isOpen, index, open, close } = usePhotoSwipe();

  if (images.length === 0) return null;

  const openableImages = images.filter((image) => Boolean(image.src));

  const openAt = (galleryIndex: number) => {
    const image = images[galleryIndex];
    const openableIndex = openableImages.findIndex(
      (item) => item.src === image.src && item.alt === image.alt,
    );
    if (openableIndex >= 0) open(openableIndex);
  };

  return (
    <section className="mt-[45vh] px-gutter-m pb-24 lg:px-gutter-d">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4">
        {images.map((image, imageIndex) => (
          <GalleryThumbnail
            key={`${image.alt}-${imageIndex}`}
            src={image.src}
            alt={image.alt}
            index={imageIndex}
            onOpen={openableImages.length > 0 ? openAt : undefined}
            overlayTitle={image.alt}
          />
        ))}
      </div>
      {openableImages.length > 0 && (
        <PhotoSwipeLightbox
          images={openableImages}
          isOpen={isOpen}
          initialIndex={index}
          onClose={close}
        />
      )}
    </section>
  );
}
