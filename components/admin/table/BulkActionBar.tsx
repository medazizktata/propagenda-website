'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BulkAction } from '@/lib/admin/table/types';
import { cn } from '@/lib/utils';

export function BulkActionBar<T>({
  selectedRows,
  actions,
  onClear,
  embedded = false,
}: {
  selectedRows: T[];
  actions: BulkAction<T>[];
  onClear: () => void;
  embedded?: boolean;
}) {
  const [running, setRunning] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (selectedRows.length === 0) return null;

  async function runAction(action: BulkAction<T>) {
    if (action.confirm && confirmId !== action.id) {
      setConfirmId(action.id);
      return;
    }

    setRunning(action.id);
    try {
      await action.run(selectedRows);
      setConfirmId(null);
      onClear();
    } finally {
      setRunning(null);
    }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        !embedded && 'border-y border-orange/25 bg-orange/5 py-2.5',
      )}
    >
      <span className="text-xs font-medium text-white/80">
        {selectedRows.length} selected
      </span>
      <div className="flex flex-wrap items-center gap-1">
        {actions.map((action) => {
          const disabled = action.isDisabled?.(selectedRows) ?? false;
          const confirming = confirmId === action.id;

          return (
            <Button
              key={action.id}
              type="button"
              size="sm"
              variant={action.destructive ? 'destructive' : 'outline'}
              className={
                action.destructive
                  ? undefined
                  : 'border-white/15 bg-transparent text-white hover:bg-white/8'
              }
              disabled={disabled || running !== null}
              onClick={() => runAction(action)}
            >
              {running === action.id
                ? 'Working…'
                : confirming && action.confirm
                  ? action.confirm
                  : action.label}
            </Button>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-white/65 hover:bg-white/8 hover:text-white"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
