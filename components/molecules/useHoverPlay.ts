'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// Shared muted-preview behaviour for poster-first video tiles: play a silent loop on hover (fine
// pointers) or while centred in view (touch), pausing otherwise. No-ops for placeholders and under
// prefers-reduced-motion. Returns refs to attach to the wrapper and the <video>.
export function useHoverPlay(playable: boolean) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!playable || reducedMotion) return;
    const wrap = wrapRef.current;
    const vid = videoRef.current;
    if (!wrap || !vid) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const play = () => {
      if (vid.preload === 'none') vid.preload = 'metadata';
      void vid.play().catch(() => {});
    };
    const stop = () => {
      vid.pause();
      vid.currentTime = 0;
    };

    if (fine) {
      wrap.addEventListener('pointerenter', play);
      wrap.addEventListener('pointerleave', stop);
      return () => {
        wrap.removeEventListener('pointerenter', play);
        wrap.removeEventListener('pointerleave', stop);
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) play();
        else vid.pause();
      },
      { threshold: 0.6 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [playable, reducedMotion]);

  return { wrapRef, videoRef, reducedMotion };
}
