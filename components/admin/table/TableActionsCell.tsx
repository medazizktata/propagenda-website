'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { TableAction } from '@/lib/admin/table/types';
import { cn } from '@/lib/utils';

export function TableActionsCell<T>({
  row,
  actions,
}: {
  row: T;
  actions: TableAction<T>[];
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  async function activate(action: TableAction<T>) {
    if (action.href) return;

    if (action.confirm && confirmId !== action.id) {
      setConfirmId(action.id);
      return;
    }

    if (!action.run) return;

    setRunning(action.id);
    try {
      await action.run(row);
      setConfirmId(null);
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-0.5">
      {actions.map((action) => {
        const disabled = action.isDisabled?.(row) ?? false;
        const confirming = confirmId === action.id;
        const label =
          running === action.id
            ? 'Working…'
            : confirming && action.confirm
              ? action.confirm
              : action.label;

        const buttonClass = cn(
          'text-white/65 hover:bg-white/8 hover:text-white',
          action.destructive && 'hover:bg-destructive/15 hover:text-destructive',
          confirming && 'bg-white/10 text-white',
        );

        if (action.href) {
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className={buttonClass}
                    disabled={disabled}
                    render={<Link href={action.href(row)} />}
                    aria-label={action.label}
                  />
                }
              >
                {action.icon}
              </TooltipTrigger>
              <TooltipContent side="bottom">{action.label}</TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Tooltip key={action.id}>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className={buttonClass}
                  disabled={disabled || running !== null}
                  onClick={() => activate(action)}
                  aria-label={label}
                />
              }
            >
              {action.icon}
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
