'use client';

import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AdminSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  className?: string;
};

export function AdminSection({
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = true,
  className,
}: AdminSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const heading = (
    <div className="min-w-0">
      <p className="text-sm font-medium text-white">{title}</p>
      {description ? <p className="mt-0.5 text-xs text-white/65">{description}</p> : null}
    </div>
  );

  return (
    <section className={cn('border-b border-white/12 pb-8 last:border-b-0', className)}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mb-4 flex w-full items-start justify-between gap-3 text-left"
        >
          {heading}
          <ChevronDown
            className={cn(
              'mt-0.5 size-4 shrink-0 text-white/65 transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>
      ) : (
        <div className="mb-4">{heading}</div>
      )}
      {(!collapsible || open) ? <div className="space-y-4">{children}</div> : null}
    </section>
  );
}

export function AdminRepeater({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('divide-y divide-white/10', className)}>{children}</div>;
}

export function AdminRepeaterItem({
  label,
  actions,
  children,
  className,
}: {
  label: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3 py-4 first:pt-0 last:pb-0', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-backstage text-white/65">{label}</p>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/12 pb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? <p className="mt-1 text-sm text-white/65">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminFlatPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('border-t border-white/12 pt-8', className)}>
      {children}
    </div>
  );
}
