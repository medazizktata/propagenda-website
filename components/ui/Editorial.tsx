import type { ElementType, ReactNode } from 'react';
import { cn } from './cn';

/** Two-digit, zero-padded index (01, 02 …) — the cuberto/micdrop section-index device. */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

type MeasureWidth = 'narrow' | 'default' | 'wide' | 'lead';

const measureClass: Record<MeasureWidth, string> = {
  narrow: 'max-w-measure-narrow',
  default: 'max-w-measure',
  wide: 'max-w-measure-wide',
  lead: 'max-w-measure-lead',
};

/**
 * Caps a text block to a comfortable reading measure (ch-based). This is the single
 * knob that keeps long-form copy from ever running edge-to-edge — the #1 fix versus
 * the old full-width paragraphs.
 */
export function Measure({
  width = 'default',
  as: Tag = 'div',
  className,
  children,
}: {
  width?: MeasureWidth;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn(measureClass[width], className)}>{children}</Tag>;
}

/**
 * Backstage label — the IBM Plex Mono "file-label" register (design-DNA §2.3). This is the
 * monospace deliverable/section-label column the graphichunters services grammar hangs on.
 * Kept dim by default so it never competes with the Poppins display voice.
 */
export function MonoLabel({
  as: Tag = 'span',
  tone = 'muted',
  className,
  children,
}: {
  as?: ElementType;
  tone?: 'muted' | 'accent' | 'ink';
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === 'accent' ? 'text-orange' : tone === 'ink' ? 'text-navy/70' : 'text-white/50';
  return (
    <Tag
      className={cn(
        'font-mono text-[0.7rem] font-medium uppercase tracking-label',
        toneClass,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Small uppercase tracked eyebrow. Optionally prefixed with a zero-padded index and a
 * short accent rule — the editorial "section marker" seen across both references.
 */
export function Eyebrow({
  index,
  rule = true,
  tone = 'accent',
  as: Tag = 'p',
  className,
  children,
}: {
  index?: number | string;
  rule?: boolean;
  tone?: 'accent' | 'muted';
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        'flex items-center gap-3 text-xs font-semibold uppercase tracking-label',
        className,
      )}
    >
      {index != null && (
        <span className="tabular-nums font-sans text-[0.72rem] font-bold text-orange">
          {typeof index === 'number' ? pad2(index) : index}
        </span>
      )}
      {rule && <span aria-hidden className="h-px w-7 shrink-0 bg-orange/55" />}
      <span className={tone === 'accent' ? 'text-orange' : 'text-white/55'}>{children}</span>
    </Tag>
  );
}

/**
 * A section header: hairline top rule, a hanging index number + eyebrow, then the
 * heading. Encodes real document structure (not decoration) and reads as one system
 * across the legal, service, and case-study pages.
 */
export function EditorialSectionHeader({
  index,
  eyebrow,
  title,
  id,
  headingClassName,
  className,
}: {
  index?: number;
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  headingClassName?: string;
  className?: string;
}) {
  return (
    <header className={cn('border-t border-white/12 pt-6', className)}>
      {(index != null || eyebrow) && (
        <div className="mb-4 flex items-center gap-4">
          {index != null && (
            <span className="tabular-nums text-sm font-bold text-orange">{pad2(index)}</span>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-label text-white/55">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <h2
        id={id}
        className={cn(
          'font-sans text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-[1.9rem]',
          headingClassName,
        )}
      >
        {title}
      </h2>
    </header>
  );
}

/**
 * Standfirst / lead paragraph — larger and lighter than body, sits directly under a
 * masthead H1 to set the reading tone (both references open sections this way).
 */
export function LeadText({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        'font-sans text-xl font-light leading-[1.5] text-white/90 md:text-[1.6rem]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
