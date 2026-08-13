'use client';

import { useState } from 'react';
import { useHoverPlay } from './useHoverPlay';
import { cn } from '@/components/ui/cn';
import type { VideoProject } from '@/types/content';

// Portrait-first reel card: tall media + caption under. Hover plays / brightens; orange play cursor.
export function VideoCard({ project, onOpen }: { project: VideoProject; onOpen?: () => void }) {
  const playable = Boolean(project.src) && !project.placeholder;
  const { wrapRef, videoRef } = useHoverPlay(playable);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const captionLead = project.client || project.category;
  const captionTrail = project.description || project.title;
  const tall = project.orientation !== 'landscape';

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!playable) return;
    const r = e.currentTarget.getBoundingClientRect();
    setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <article className="group/card flex flex-col gap-5">
      <div
        ref={wrapRef}
        onPointerMove={onMove}
        onPointerEnter={onMove}
        onPointerLeave={() => setCursor(null)}
        className={cn(
          'relative overflow-hidden rounded-[1.5rem] bg-black md:rounded-[2rem] lg:rounded-[2.5rem]',
          tall ? 'aspect-[9/14]' : 'aspect-video',
          playable && 'cursor-none',
        )}
      >
        {playable ? (
          <video
            ref={videoRef}
            src={project.src}
            poster={project.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/card:scale-[1.04] group-hover/card:brightness-[1.08]"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.poster}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/card:scale-[1.04] group-hover/card:opacity-100 group-hover/card:brightness-[1.18]"
            />
            <span className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm transition-opacity duration-500 group-hover/card:opacity-0">
              Soon
            </span>
          </>
        )}

        {playable && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute z-20 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange text-black shadow-[0_12px_40px_-10px_rgba(245,139,39,0.55)] transition-[opacity,transform] duration-300 ease-out md:flex',
              cursor ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
            style={
              cursor
                ? { left: cursor.x, top: cursor.y, transitionProperty: 'opacity, transform' }
                : { left: '50%', top: '50%' }
            }
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        )}

        {playable && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Play ${project.title} full-screen`}
            className="absolute inset-0 z-30 cursor-none"
          />
        )}
      </div>

      <p className="max-w-[34ch] text-control leading-snug text-white/55 transition-colors duration-500 group-hover/card:text-white/70 md:text-base">
        <span className="font-semibold text-white">{captionLead}</span>
        <span aria-hidden> – </span>
        <span>{captionTrail}</span>
      </p>
    </article>
  );
}
