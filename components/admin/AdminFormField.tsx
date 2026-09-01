'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function AdminFormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-white">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-white/55">{hint}</p> : null}
    </div>
  );
}

export function AdminFormRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-5 md:grid-cols-2', className)}>{children}</div>
  );
}

export function AdminDimPair({
  widthId,
  heightId,
  width,
  height,
  onWidthChange,
  onHeightChange,
}: {
  widthId: string;
  heightId: string;
  width: number;
  height: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
}) {
  return (
    <div className="grid max-w-[12rem] grid-cols-2 gap-2">
      <div className="grid gap-1">
        <Label htmlFor={widthId} className="text-[11px] text-white/55">
          W
        </Label>
        <Input
          id={widthId}
          type="number"
          min={1}
          value={width || ''}
          onChange={(e) => onWidthChange(Number(e.target.value) || 0)}
          className="admin-field h-9"
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor={heightId} className="text-[11px] text-white/55">
          H
        </Label>
        <Input
          id={heightId}
          type="number"
          min={1}
          value={height || ''}
          onChange={(e) => onHeightChange(Number(e.target.value) || 0)}
          className="admin-field h-9"
        />
      </div>
    </div>
  );
}
