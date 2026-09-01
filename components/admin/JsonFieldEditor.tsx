'use client';

import { Braces } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { jsonParseError, prettyJsonString } from '@/lib/cms/services/json-fields';
import { cn } from '@/lib/utils';

type JsonFieldEditorProps = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  emptyFallback?: string;
  rows?: number;
  className?: string;
};

export function JsonFieldEditor({
  id,
  label,
  hint,
  value,
  onChange,
  emptyFallback = '',
  rows = 8,
  className,
}: JsonFieldEditorProps) {
  const parseError = useMemo(() => jsonParseError(value), [value]);

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Label htmlFor={id} className="text-sm font-medium text-white">
            {label}
          </Label>
          {hint ? <p className="mt-0.5 text-xs text-white/65">{hint}</p> : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-white/15 bg-transparent text-white hover:bg-white/5"
          onClick={() => onChange(prettyJsonString(value, emptyFallback))}
        >
          <Braces className="size-3.5" />
          Format
        </Button>
      </div>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          'admin-field min-h-[120px] font-mono text-xs leading-relaxed',
          parseError && 'border-destructive/50 focus-visible:ring-destructive/30',
        )}
      />
      {parseError ? (
        <p className="text-xs text-destructive">{parseError}</p>
      ) : (
        <p className="text-xs text-white/50">Valid JSON</p>
      )}
    </div>
  );
}
