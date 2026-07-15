'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/components/ui/cn';

export type LightboxVideo = {
  src: string;
  width?: number;
  height?: number;
  title?: string;
  poster?: string;
};

type VideoLightboxProps = {
  video: LightboxVideo | null;
  isOpen: boolean;
  onClose: () => void;
};

const EXIT_MS = 280;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Minimal video modal — custom controls, smooth open/close.
 */
export function VideoLightbox({ video, isOpen, onClose }: VideoLightboxProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  }, []);

  const seekFromClientX = useCallback((clientX: number) => {
    const el = videoRef.current;
    const track = trackRef.current;
    if (!el || !track || !el.duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setCurrent(el.currentTime);
  }, []);

  // Mount / enter / exit choreography
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setPlaying(false);
      setCurrent(0);
      setDuration(0);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm') {
        const el = videoRef.current;
        if (!el) return;
        el.muted = !el.muted;
        setMuted(el.muted);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      videoRef.current?.pause();
    };
  }, [mounted, isOpen, onClose, togglePlay]);

  useEffect(() => {
    if (!scrubbing) return;
    const onMove = (e: PointerEvent) => seekFromClientX(e.clientX);
    const onUp = () => setScrubbing(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [scrubbing, seekFromClientX]);

  if (!mounted || !video || typeof document === 'undefined') return null;

  const iconBtn =
    'transition-hover inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover-fine:hover:bg-white/10 hover-fine:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={video.title ? titleId : undefined}
      className="fixed inset-0 z-lightbox flex items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close"
        className={cn(
          'absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative z-10 flex w-full max-w-3xl flex-col gap-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-w-4xl',
          entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.98] opacity-0',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {video.title ? (
            <p
              id={titleId}
              className="truncate text-sm font-medium tracking-tight text-white/70"
            >
              {video.title}
            </p>
          ) : (
            <span />
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={cn(iconBtn, 'border border-white/10 bg-white/5')}
            aria-label="Close video"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="group/player relative overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl">
          <button
            type="button"
            className="relative block w-full cursor-pointer"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <video
              ref={videoRef}
              className="mx-auto max-h-[min(62vh,560px)] w-full bg-black object-contain"
              src={video.src}
              poster={video.poster}
              playsInline
              autoPlay
              muted={muted}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={() => {
                if (!scrubbing && videoRef.current) setCurrent(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              onEnded={() => setPlaying(false)}
              style={
                video.width && video.height
                  ? { aspectRatio: `${video.width} / ${video.height}` }
                  : undefined
              }
            />
            {!playing ? (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-transparent text-white">
                  <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                </span>
              </span>
            ) : null}
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10">
            <div
              ref={trackRef}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(current)}
              tabIndex={0}
              className="group/track relative mb-2.5 h-1 cursor-pointer rounded-full bg-white/15"
              onPointerDown={(e) => {
                e.preventDefault();
                setScrubbing(true);
                seekFromClientX(e.clientX);
              }}
              onKeyDown={(e) => {
                const el = videoRef.current;
                if (!el || !el.duration) return;
                if (e.key === 'ArrowRight') el.currentTime = Math.min(el.duration, el.currentTime + 5);
                if (e.key === 'ArrowLeft') el.currentTime = Math.max(0, el.currentTime - 5);
                setCurrent(el.currentTime);
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-75"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/track:opacity-100 group-focus-within/track:opacity-100"
                style={{ left: `calc(${progress * 100}% - 5px)` }}
              />
            </div>

            <div className="flex items-center gap-1">
              <button type="button" className={iconBtn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className={iconBtn}
                onClick={() => {
                  const el = videoRef.current;
                  if (!el) return;
                  el.muted = !el.muted;
                  setMuted(el.muted);
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
                    <path d="m22 9-6 6M16 9l6 6" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              <span className="ml-1.5 tabular-nums text-[11px] tracking-wide text-white/55">
                {formatTime(current)}
                <span className="text-white/30"> / </span>
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
