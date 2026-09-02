import type { FilterFieldKind, FilterOperator, FilterRule } from '@/lib/admin/table/types';

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'is',
  notEquals: 'is not',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'is one of',
  notIn: 'is not one of',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
};

export const OPERATORS_BY_KIND: Record<FilterFieldKind, FilterOperator[]> = {
  text: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
  enum: ['equals', 'notEquals', 'in', 'notIn', 'isEmpty', 'isNotEmpty'],
  date: ['equals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
};

export function newRuleId(): string {
  return `r_${Math.random().toString(36).slice(2, 10)}`;
}

export function defaultOperator(kind: FilterFieldKind): FilterOperator {
  return OPERATORS_BY_KIND[kind][0] ?? 'equals';
}

export function ruleNeedsValue(operator: FilterOperator): boolean {
  return !['isEmpty', 'isNotEmpty'].includes(operator);
}

export function formatRuleValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '…';
  }
  const text = String(value ?? '').trim();
  return text || '…';
}

export function formatRuleSummary(
  rule: FilterRule,
  fieldLabel: string,
  options?: Array<{ value: string; label: string }>,
): string {
  const parts = formatRuleParts(rule, fieldLabel, options);
  if (!parts.value) return `${parts.field} ${parts.operator}`;
  return `${parts.field} ${parts.operator} ${parts.value}`;
}

export function formatRuleParts(
  rule: FilterRule,
  fieldLabel: string,
  options?: Array<{ value: string; label: string }>,
): { field: string; operator: string; value: string | null } {
  const operator = OPERATOR_LABELS[rule.operator];

  if (!ruleNeedsValue(rule.operator)) {
    return { field: fieldLabel, operator, value: null };
  }

  let value = formatRuleValue(rule.value);
  if (options?.length) {
    const map = new Map(options.map((opt) => [opt.value, opt.label]));
    if (Array.isArray(rule.value)) {
      value = rule.value.map((v) => map.get(String(v)) ?? String(v)).join(', ');
    } else {
      value = map.get(String(rule.value)) ?? value;
    }
  }

  return { field: fieldLabel, operator, value };
}

export type QuickFilterPreset = {
  id: string;
  label: string;
  /** Replace rules on these fields when applying this preset. */
  scopeFields: string[];
  rules: Array<Pick<FilterRule, 'field' | 'operator' | 'value'>>;
};

export function isQuickFilterActive(rules: FilterRule[], preset: QuickFilterPreset): boolean {
  const scoped = rules.filter((rule) => preset.scopeFields.includes(rule.field));

  if (preset.rules.length === 0) {
    return scoped.length === 0;
  }

  if (scoped.length !== preset.rules.length) return false;

  return preset.rules.every((template) =>
    scoped.some(
      (rule) =>
        rule.field === template.field &&
        rule.operator === template.operator &&
        JSON.stringify(rule.value) === JSON.stringify(template.value),
    ),
  );
}

export function applyQuickFilter(
  rules: FilterRule[],
  preset: QuickFilterPreset,
): FilterRule[] {
  const kept = rules.filter((rule) => !preset.scopeFields.includes(rule.field));
  const added = preset.rules.map((template, index) => ({
    id: newRuleId(),
    field: template.field,
    operator: template.operator,
    value: template.value,
    conjunction: kept.length > 0 || index > 0 ? ('and' as const) : undefined,
  }));
  return [...kept, ...added];
}
