'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3">
      <span className="text-sm text-orange-200">
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
              variant={action.destructive ? 'invert' : 'secondary'}
              className={action.destructive ? 'border border-red-500/50' : undefined}
              disabled={disabled || running !== null}
              loading={running === action.id}
              onClick={() => runAction(action)}
            >
              {confirming && action.confirm ? action.confirm : action.label}
            </Button>
          );
        })}
        <Button type="button" size="sm" variant="text" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
