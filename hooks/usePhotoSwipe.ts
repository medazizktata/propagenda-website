'use client';

import { useCallback, useState } from 'react';

export function usePhotoSwipe() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, index, open, close };
}
