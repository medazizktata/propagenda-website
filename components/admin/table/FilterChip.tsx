'use client';

import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatRuleParts, formatRuleSummary } from '@/lib/admin/table/filter-utils';
import type { FilterRule } from '@/lib/admin/table/types';

export function FilterChip({
  rule,
  fieldLabel,
  options,
  onEdit,
  onRemove,
}: {
  rule: FilterRule;
  fieldLabel: string;
  options?: Array<{ value: string; label: string }>;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const parts = formatRuleParts(rule, fieldLabel, options);
  const fullLabel = formatRuleSummary(rule, fieldLabel, options);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex max-w-[14rem] items-center rounded-lg border border-white/12 bg-white/[0.04] text-xs">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-w-0 items-center gap-1 px-2 py-1.5 text-left hover:bg-white/[0.04]"
              aria-label={`Edit filter: ${fullLabel}`}
            >
              <span className="shrink-0 text-white/50">{parts.field}</span>
              <span className="shrink-0 text-white/35">{parts.operator}</span>
              {parts.value ? (
                <span className="truncate font-medium text-white">{parts.value}</span>
              ) : null}
            </button>
            <button
              type="button"
              className="shrink-0 border-l border-white/10 px-1.5 py-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white"
              onClick={onRemove}
              aria-label={`Remove filter: ${fullLabel}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        }
      />
      <TooltipContent side="bottom">{fullLabel}</TooltipContent>
    </Tooltip>
  );
}
