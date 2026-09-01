'use client';

import { useMemo, useState } from 'react';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterFieldKind, FilterOperator, FilterRule, TableColumn } from '@/lib/admin/table/types';

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'equals',
  notEquals: 'not equals',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'is one of',
  notIn: 'is not one of',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

const OPERATORS_BY_KIND: Record<FilterFieldKind, FilterOperator[]> = {
  text: ['equals', 'notEquals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
  enum: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
  date: ['equals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
};

function newRuleId(): string {
  return `r_${Math.random().toString(36).slice(2, 10)}`;
}

function defaultOperator(kind: FilterFieldKind): FilterOperator {
  return OPERATORS_BY_KIND[kind][0] ?? 'equals';
}

export function FilterBar<T>({
  columns,
  rules,
  onChange,
}: {
  columns: TableColumn<T>[];
  rules: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const filterable = useMemo(
    () => columns.filter((c) => c.filter && c.key !== 'select'),
    [columns],
  );

  function addRule() {
    const first = filterable[0];
    if (!first?.filter) return;
    onChange([
      ...rules,
      {
        id: newRuleId(),
        field: first.key,
        operator: defaultOperator(first.filter.kind),
        value: first.filter.kind === 'enum' ? [] : '',
        conjunction: rules.length > 0 ? 'and' : undefined,
      },
    ]);
    setOpen(true);
  }

  function updateRule(id: string, patch: Partial<FilterRule>) {
    onChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRule(id: string) {
    onChange(rules.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRule}>
          <Plus className="size-3.5" />
          Add filter
        </Button>
        {rules.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange([])}>
            Clear all
          </Button>
        )}
        {rules.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Filter className="size-3.5" />
            {open ? 'Hide' : 'Show'} rules ({rules.length})
          </button>
        )}
      </div>

      {open && rules.length > 0 && (
        <div className="space-y-2 border-t border-white/12 pt-3">
          {rules.map((rule, index) => {
            const col = filterable.find((c) => c.key === rule.field) ?? filterable[0];
            const kind = col?.filter?.kind ?? 'text';
            const operators = OPERATORS_BY_KIND[kind];
            const needsValue = !['isEmpty', 'isNotEmpty'].includes(rule.operator);

            return (
              <div key={rule.id} className="flex flex-wrap items-center gap-2">
                {index > 0 && (
                  <Select
                    value={rule.conjunction ?? 'and'}
                    onValueChange={(value) =>
                      updateRule(rule.id, { conjunction: value as 'and' | 'or' })
                    }
                  >
                    <SelectTrigger className="h-8 w-[88px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">AND</SelectItem>
                      <SelectItem value="or">OR</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={rule.field}
                  onValueChange={(value) => {
                    const nextCol = filterable.find((c) => c.key === value);
                    const nextKind = nextCol?.filter?.kind ?? 'text';
                    updateRule(rule.id, {
                      field: value ?? '',
                      operator: defaultOperator(nextKind),
                      value: nextKind === 'enum' ? [] : '',
                    });
                  }}
                >
                  <SelectTrigger className="h-8 min-w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterable.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {typeof c.label === 'string' ? c.label : c.key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={rule.operator}
                  onValueChange={(value) =>
                    updateRule(rule.id, { operator: value as FilterOperator })
                  }
                >
                  <SelectTrigger className="h-8 min-w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op} value={op}>
                        {OPERATOR_LABELS[op]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {needsValue && kind === 'enum' && (
                  <select
                    multiple
                    value={Array.isArray(rule.value) ? (rule.value as string[]) : []}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        value: Array.from(e.target.selectedOptions).map((o) => o.value),
                      })
                    }
                    className="min-h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2 py-1.5 text-sm"
                  >
                    {col?.filter?.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {needsValue && kind !== 'enum' && (
                  <Input
                    type={kind === 'number' ? 'number' : kind === 'date' ? 'date' : 'text'}
                    value={String(rule.value ?? '')}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="h-8 min-w-[140px] flex-1"
                    placeholder="Value"
                  />
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRule(rule.id)}
                  aria-label="Remove filter"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
