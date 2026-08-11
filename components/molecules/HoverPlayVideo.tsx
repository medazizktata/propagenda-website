'use client';

import { useHoverPlay } from './useHoverPlay';
import { cn } from '@/components/ui/cn';
import type { VideoProject } from '@/types/content';

interface HoverPlayVideoProps {
  project: VideoProject;
  className?: string;
  rounded?: string;
  /** Hide the bottom category/title meta overlay (e.g. for the featured film). */
  hideMeta?: boolean;
  /** Open fullscreen (lightbox). Only wired when the project has a real src. */
  onOpen?: () => void;
}

// A muted, poster-first video tile. On hover (fine pointer) or when centred in view (touch), it
// plays a silent loop; click opens fullscreen. Poster-only placeholders render as swap-in slots.
// Respects prefers-reduced-motion (poster stays, no autoplay).
export function HoverPlayVideo({
  project,
  className,
  rounded = 'rounded-2xl',
  hideMeta = false,
  onOpen,
}: HoverPlayVideoProps) {
  const playable = Boolean(project.src) && !project.placeholder;
  const aspect = project.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';
  const { wrapRef, videoRef } = useHoverPlay(playable);

  return (
    <div
      ref={wrapRef}
      className={cn('group/hv relative overflow-hidden bg-black ring-1 ring-white/10', aspect, rounded, className)}
    >
      {playable ? (
        <>
          <video
            ref={videoRef}
            src={project.src}
            poster={project.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Play ${project.title} fullscreen`}
            className="absolute inset-0 cursor-pointer"
          >
            {/* Play badge — fades out while the loop plays on hover. */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/hv:opacity-0">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm">
                <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-5 w-5 fill-current">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
            </span>
          </button>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.poster}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale-[0.3]"
          />
          <div aria-hidden className="absolute inset-0 bg-black/45" />
          <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
            Soon
          </span>
        </>
      )}

      {/* Meta — category + title (+ client). */}
      {!hideMeta && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-orange">
            {project.category}
          </span>
          <p className="mt-0.5 font-sans text-sm font-bold leading-tight text-white">{project.title}</p>
          {project.client && (
            <p className="mt-0.5 truncate text-[0.7rem] text-white/55">{project.client}</p>
          )}
        </div>
      )}
    </div>
  );
}
