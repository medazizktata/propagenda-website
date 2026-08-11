'use client';

import { useHoverPlay } from './useHoverPlay';
import type { VideoProject } from '@/types/content';

// Large editorial card: media fills the frame, the story sits bottom-left, a circular action sits
// bottom-right. Real cuts hover-preview and open full-screen; placeholders read as "Soon" slots.
export function VideoCard({ project, onOpen }: { project: VideoProject; onOpen?: () => void }) {
  const playable = Boolean(project.src) && !project.placeholder;
  const { wrapRef, videoRef } = useHoverPlay(playable);

  return (
    <article
      ref={wrapRef}
      className="group/card relative aspect-[4/5] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.04]"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.poster}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale-[0.2] transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.04]"
          />
          <span className="absolute right-4 top-4 z-20 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
            Soon
          </span>
        </>
      )}

      {/* Legibility scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"
      />

      {/* Story + action */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-6">
        <div className="min-w-0">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-orange">
            {project.category}
          </span>
          <h3
            className="mt-1 font-sans font-bold leading-[1.05] text-white"
            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)' }}
          >
            {project.title}
          </h3>
          {project.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/65">
              {project.description}
            </p>
          )}
          {project.client && (
            <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/45">
              {project.client}
            </p>
          )}
        </div>

        <span
          aria-hidden
          className={
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ' +
            (playable
              ? 'border-white/25 bg-black/35 text-white backdrop-blur-sm group-hover/card:border-orange group-hover/card:bg-orange group-hover/card:text-black'
              : 'border-white/15 text-white/40')
          }
        >
          {playable ? (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {playable && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Play ${project.title} full-screen`}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      )}
    </article>
  );
}
