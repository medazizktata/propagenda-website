'use client';

import { ImageIcon, ImageOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AdminImageFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** @deprecated Use layout="inline" */
  compact?: boolean;
  layout?: 'stack' | 'inline' | 'leading';
};

export function resolveImageSrc(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function AdminImageField({
  id,
  value,
  onChange,
  placeholder = '/images/...',
  className,
  compact = false,
  layout,
}: AdminImageFieldProps) {
  const resolvedLayout = layout ?? (compact ? 'inline' : 'stack');

  if (resolvedLayout === 'leading') {
    return (
      <div className={cn('flex gap-3', className)}>
        <AdminImageThumb src={value} size="md" />
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-field h-10 min-w-0 flex-1 font-mono text-sm"
        />
      </div>
    );
  }

  const src = useMemo(() => resolveImageSrc(value), [value]);

  return (
    <div className={cn('space-y-3', resolvedLayout === 'inline' && 'space-y-2', className)}>
      <div className={cn(resolvedLayout === 'inline' && 'flex items-start gap-3')}>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'admin-field h-10 font-mono text-sm',
            resolvedLayout === 'inline' && 'min-w-0 flex-1',
          )}
        />
        {resolvedLayout === 'inline' && src ? (
          <AdminImageThumb src={value} size="sm" />
        ) : null}
      </div>

      {resolvedLayout === 'stack' && src ? (
        <AdminImageThumb src={value} size="lg" className="w-full" />
      ) : null}
    </div>
  );
}

type ThumbSize = 'sm' | 'md' | 'lg';

const THUMB_SIZE: Record<ThumbSize, string> = {
  sm: 'size-14',
  md: 'h-[4.5rem] w-[6.5rem]',
  lg: 'h-36 w-full max-w-md',
};

export function AdminImageThumb({
  src: rawSrc,
  size = 'md',
  className,
}: {
  src: string;
  size?: ThumbSize;
  className?: string;
}) {
  const src = useMemo(() => resolveImageSrc(rawSrc), [rawSrc]);
  const [state, setState] = useState<'empty' | 'loading' | 'loaded' | 'error'>('empty');

  useEffect(() => {
    setState(src ? 'loading' : 'empty');
  }, [src]);

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-md bg-white/[0.04]',
        THUMB_SIZE[size],
        className,
      )}
    >
      {state === 'empty' ? (
        <div className="flex size-full flex-col items-center justify-center gap-1 text-white/30">
          <ImageIcon className="size-5" />
          {size !== 'sm' ? <span className="text-[10px]">No image</span> : null}
        </div>
      ) : null}

      {state === 'loading' ? (
        <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
      ) : null}

      {state === 'error' ? (
        <div className="flex size-full flex-col items-center justify-center gap-1 px-1 text-center text-white/40">
          <ImageOff className="size-4" />
          <span className="text-[10px] leading-tight">Not found</span>
        </div>
      ) : null}

      {src && state !== 'error' ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin asset preview
        <img
          src={src}
          alt=""
          className={cn(
            'size-full object-cover',
            state === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      ) : null}
    </div>
  );
}
