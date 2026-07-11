'use client';

import { useEffect, useRef } from 'react';
import PSPLightbox from 'photoswipe/lightbox';
import type { GalleryImage } from '@/types/content';
import 'photoswipe/photoswipe.css';

interface PhotoSwipeLightboxProps {
  images: GalleryImage[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function PhotoSwipeLightbox({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
}: PhotoSwipeLightboxProps) {
  const instanceRef = useRef<PSPLightbox | null>(null);

  useEffect(() => {
    if (!isOpen || images.length === 0) return;

    const lightbox = new PSPLightbox({
      dataSource: images.map((image) => ({
        src: image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      })),
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.9,
    });

    lightbox.on('close', () => onClose());
    lightbox.init();
    instanceRef.current = lightbox;
    lightbox.loadAndOpen(initialIndex);

    return () => {
      lightbox.destroy();
      instanceRef.current = null;
    };
  }, [isOpen, initialIndex, images, onClose]);

  return null;
}
