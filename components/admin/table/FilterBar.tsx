'use client';

import { Filter, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterChip } from '@/components/admin/table/FilterChip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  applyQuickFilter,
  defaultOperator,
  isQuickFilterActive,
  newRuleId,
  OPERATOR_LABELS,
  OPERATORS_BY_KIND,
  ruleNeedsValue,
  type QuickFilterPreset,
} from '@/lib/admin/table/filter-utils';
import type { FilterRule, TableColumn } from '@/lib/admin/table/types';
import { cn } from '@/lib/utils';

function EnumValueEditor({
  options,
  operator,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  operator: FilterRule['operator'];
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const multi = operator === 'in' || operator === 'notIn';
  const selected = Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];

  if (multi) {
    return (
      <div className="flex min-w-0 flex-1 flex-wrap gap-1">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                const next = active
                  ? selected.filter((v) => v !== opt.value)
                  : [...selected, opt.value];
                onChange(next);
              }}
              className={cn(
                'rounded-md border px-2 py-1 text-xs transition-colors',
                active
                  ? 'border-orange/40 bg-orange/15 text-white'
                  : 'border-white/12 text-white/65 hover:border-white/25 hover:text-white',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Select value={selected[0] ?? ''} onValueChange={(next) => onChange(next ?? '')}>
      <SelectTrigger className="admin-field h-8 min-w-0 flex-1">
        <SelectValue placeholder="Value" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterRuleRow<T>({
  rule,
  index,
  filterable,
  onChange,
  onRemove,
}: {
  rule: FilterRule;
  index: number;
  filterable: TableColumn<T>[];
  onChange: (patch: Partial<FilterRule>) => void;
  onRemove: () => void;
}) {
  const col = filterable.find((c) => c.key === rule.field) ?? filterable[0];
  const kind = col?.filter?.kind ?? 'text';
  const operators = OPERATORS_BY_KIND[kind];
  const needsValue = ruleNeedsValue(rule.operator);

  return (
    <div className="grid grid-cols-[4.5rem_minmax(6rem,0.9fr)_minmax(6rem,0.8fr)_minmax(8rem,1.2fr)_2rem] items-center gap-2">
      {index > 0 ? (
        <Select
          value={rule.conjunction ?? 'and'}
          onValueChange={(value) => onChange({ conjunction: value as 'and' | 'or' })}
        >
          <SelectTrigger className="admin-field h-8 w-full px-2 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="and">AND</SelectItem>
            <SelectItem value="or">OR</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <span className="text-backstage px-1 text-white/40">WHERE</span>
      )}

      <Select
        value={rule.field}
        onValueChange={(value) => {
          const nextCol = filterable.find((c) => c.key === value);
          const nextKind = nextCol?.filter?.kind ?? 'text';
          onChange({
            field: value ?? '',
            operator: defaultOperator(nextKind),
            value: nextKind === 'enum' ? [] : '',
          });
        }}
      >
        <SelectTrigger className="admin-field h-8 w-full min-w-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filterable.map((column) => (
            <SelectItem key={column.key} value={column.key}>
              {typeof column.label === 'string' ? column.label : column.key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(value) => onChange({ operator: value as FilterRule['operator'] })}
      >
        <SelectTrigger className="admin-field h-8 w-full min-w-0">
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

      <div className="min-w-0">
        {!needsValue ? (
          <span className="text-xs text-white/40">—</span>
        ) : kind === 'enum' ? (
          <EnumValueEditor
            options={col?.filter?.options ?? []}
            operator={rule.operator}
            value={rule.value}
            onChange={(value) => onChange({ value })}
          />
        ) : (
          <Input
            type={kind === 'number' ? 'number' : kind === 'date' ? 'date' : 'text'}
            value={String(rule.value ?? '')}
            onChange={(e) => onChange({ value: e.target.value })}
            className="admin-field h-8 min-w-0"
            placeholder="Value"
          />
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-white/50 hover:text-white"
        onClick={onRemove}
        aria-label="Remove filter"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

export function FilterBar<T>({
  columns,
  rules,
  onChange,
  quickFilters = [],
}: {
  columns: TableColumn<T>[];
  rules: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
  quickFilters?: QuickFilterPreset[];
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const filterable = useMemo(
    () => columns.filter((c) => c.filter && c.key !== 'select' && !c.pinned),
    [columns],
  );

  const ruleMeta = useMemo(
    () =>
      rules.map((rule) => {
        const col = filterable.find((c) => c.key === rule.field);
        const fieldLabel = typeof col?.label === 'string' ? col.label : rule.field;
        return {
          rule,
          fieldLabel,
          options: col?.filter?.options,
        };
      }),
    [rules, filterable],
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
    setPanelOpen(true);
  }

  function updateRule(id: string, patch: Partial<FilterRule>) {
    onChange(rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  }

  function removeRule(id: string) {
    onChange(rules.filter((rule) => rule.id !== id));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {quickFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {quickFilters.map((preset) => {
            const active = isQuickFilterActive(rules, preset);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(applyQuickFilter(rules, preset))}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'bg-orange text-ink'
                    : 'border border-white/12 text-white/70 hover:border-white/25 hover:text-white',
                )}
                aria-pressed={active}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <DropdownMenu open={panelOpen} onOpenChange={setPanelOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/8"
              />
            }
          >
            <Filter className="size-3.5" />
            Advanced
            {rules.length > 0 ? <span className="text-white/55">({rules.length})</span> : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[min(calc(100vw-2rem),42rem)] border-white/12 bg-black p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">Advanced filters</p>
              <div className="flex items-center gap-1">
                <Button type="button" size="sm" variant="ghost" className="h-8" onClick={addRule}>
                  <Plus className="size-3.5" />
                  Add rule
                </Button>
                {rules.length > 0 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 text-white/65"
                    onClick={() => onChange([])}
                  >
                    Clear all
                  </Button>
                ) : null}
              </div>
            </div>

            {rules.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/50">
                No advanced rules. Use quick filters above or add a custom rule.
              </p>
            ) : (
              <div className="max-h-[min(50vh,18rem)] overflow-y-auto overflow-x-auto">
                <div className="min-w-[36rem] space-y-2">
                  {rules.map((rule, index) => (
                    <FilterRuleRow
                      key={rule.id}
                      rule={rule}
                      index={index}
                      filterable={filterable}
                      onChange={(patch) => updateRule(rule.id, patch)}
                      onRemove={() => removeRule(rule.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {ruleMeta.length > 0 ? (
          <span className="hidden h-4 w-px shrink-0 bg-white/12 sm:block" aria-hidden />
        ) : null}

        {ruleMeta.map(({ rule, fieldLabel, options }) => (
          <FilterChip
            key={rule.id}
            rule={rule}
            fieldLabel={fieldLabel}
            options={options}
            onEdit={() => setPanelOpen(true)}
            onRemove={() => removeRule(rule.id)}
          />
        ))}

        {rules.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-white/50 hover:text-white"
            onClick={() => onChange([])}
          >
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
