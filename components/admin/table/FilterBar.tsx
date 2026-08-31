'use client';

import { useMemo, useState } from 'react';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormFields';
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
        <Button type="button" variant="secondary" size="sm" onClick={addRule}>
          <Plus className="size-3.5" aria-hidden />
          Add filter
        </Button>
        {rules.length > 0 && (
          <Button type="button" variant="text" size="sm" onClick={() => onChange([])}>
            Clear all
          </Button>
        )}
        {rules.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200"
          >
            <Filter className="size-3.5" aria-hidden />
            {open ? 'Hide' : 'Show'} rules ({rules.length})
          </button>
        )}
      </div>

      {open && rules.length > 0 && (
        <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
          {rules.map((rule, index) => {
            const col = filterable.find((c) => c.key === rule.field) ?? filterable[0];
            const kind = col?.filter?.kind ?? 'text';
            const operators = OPERATORS_BY_KIND[kind];
            const needsValue = !['isEmpty', 'isNotEmpty'].includes(rule.operator);

            return (
              <div key={rule.id} className="flex flex-wrap items-center gap-2">
                {index > 0 && (
                  <select
                    value={rule.conjunction ?? 'and'}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        conjunction: e.target.value as 'and' | 'or',
                      })
                    }
                    className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-300"
                  >
                    <option value="and">AND</option>
                    <option value="or">OR</option>
                  </select>
                )}

                <select
                  value={rule.field}
                  onChange={(e) => {
                    const nextCol = filterable.find((c) => c.key === e.target.value);
                    const nextKind = nextCol?.filter?.kind ?? 'text';
                    updateRule(rule.id, {
                      field: e.target.value,
                      operator: defaultOperator(nextKind),
                      value: nextKind === 'enum' ? [] : '',
                    });
                  }}
                  className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-200"
                >
                  {filterable.map((c) => (
                    <option key={c.key} value={c.key}>
                      {typeof c.label === 'string' ? c.label : c.key}
                    </option>
                  ))}
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) =>
                    updateRule(rule.id, { operator: e.target.value as FilterOperator })
                  }
                  className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-200"
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>
                      {OPERATOR_LABELS[op]}
                    </option>
                  ))}
                </select>

                {needsValue && kind === 'enum' && (
                  <select
                    multiple
                    value={Array.isArray(rule.value) ? (rule.value as string[]) : []}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        value: Array.from(e.target.selectedOptions).map((o) => o.value),
                      })
                    }
                    className="min-w-[140px] rounded border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-200"
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
                    className="h-9 min-w-[140px] flex-1"
                    placeholder="Value"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeRule(rule.id)}
                  className="rounded p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
                  aria-label="Remove filter"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
