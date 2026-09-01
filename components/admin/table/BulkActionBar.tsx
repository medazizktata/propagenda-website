'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BulkAction } from '@/lib/admin/table/types';

export function BulkActionBar<T>({
  selectedRows,
  actions,
  onClear,
}: {
  selectedRows: T[];
  actions: BulkAction<T>[];
  onClear: () => void;
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
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/25 bg-accent/40 px-4 py-3">
      <span className="text-sm font-medium text-accent-foreground">
        {selectedRows.length} selected
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => {
          const disabled = action.isDisabled?.(selectedRows) ?? false;
          const confirming = confirmId === action.id;

          return (
            <Button
              key={action.id}
              type="button"
              size="sm"
              variant={action.destructive ? 'destructive' : 'secondary'}
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
        <Button type="button" size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
