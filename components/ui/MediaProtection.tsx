'use client';

import { useEffect } from 'react';
import { useIsAdminRoute } from '@/hooks/useIsAdminRoute';

// Deterrent, not a lock (explicit user direction, 2026-09-25: make downloading the work "a pain
// for anyone trying to steal" it): blocks the right-click menu and drag-out on images and videos
// site-wide, so "Save image as…" / "Save video as…" / dragging a file to the desktop don't work.
// Long-press save on touch is handled by `-webkit-touch-callout: none` in globals.css. Devtools
// and screen recording still work — the watermark burned into every work file is the protection.
// Off on /admin, where editors handle media.
export function MediaProtection() {
  const isAdminRoute = useIsAdminRoute();

  useEffect(() => {
    if (isAdminRoute) return;
    const block = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.('img, video, picture')) e.preventDefault();
    };
    document.addEventListener('contextmenu', block);
    document.addEventListener('dragstart', block);
    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('dragstart', block);
    };
  }, [isAdminRoute]);

  return null;
}
