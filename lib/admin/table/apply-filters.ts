import type { FilterRule, SortState, TableColumn } from '@/lib/admin/table/types';

function getValue<T>(row: T, col: TableColumn<T> | undefined, key: string): unknown {
  if (col?.filter?.accessor) return col.filter.accessor(row);
  return (row as Record<string, unknown>)[key];
}

function toLower(v: unknown): string {
  return typeof v === 'string' ? v.toLowerCase() : String(v ?? '').toLowerCase();
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function evaluateRule<T>(
  row: T,
  rule: FilterRule,
  colByKey: Map<string, TableColumn<T>>,
): boolean {
  const col = colByKey.get(rule.field);
  const raw = getValue(row, col, rule.field);

  switch (rule.operator) {
    case 'isEmpty':
      return (
        raw === null ||
        raw === undefined ||
        raw === '' ||
        (Array.isArray(raw) && raw.length === 0)
      );
    case 'isNotEmpty':
      return !(
        raw === null ||
        raw === undefined ||
        raw === '' ||
        (Array.isArray(raw) && raw.length === 0)
      );
    case 'equals':
      return toLower(raw) === toLower(rule.value);
    case 'notEquals':
      return toLower(raw) !== toLower(rule.value);
    case 'contains':
      return toLower(raw).includes(toLower(rule.value));
    case 'startsWith':
      return toLower(raw).startsWith(toLower(rule.value));
    case 'endsWith':
      return toLower(raw).endsWith(toLower(rule.value));
    case 'in': {
      const list = Array.isArray(rule.value) ? rule.value : [];
      const lowered = list.map((v) => toLower(v));
      if (Array.isArray(raw)) return raw.some((r) => lowered.includes(toLower(r)));
      return lowered.includes(toLower(raw));
    }
    case 'notIn': {
      const list = Array.isArray(rule.value) ? rule.value : [];
      const lowered = list.map((v) => toLower(v));
      if (Array.isArray(raw)) return !raw.some((r) => lowered.includes(toLower(r)));
      return !lowered.includes(toLower(raw));
    }
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte': {
      const rawDate = raw instanceof Date ? raw : new Date(String(raw));
      const isDate = !Number.isNaN(rawDate.getTime()) && String(raw).includes('-');
      if (isDate) {
        const cmpDate = new Date(String(rule.value));
        if (Number.isNaN(cmpDate.getTime())) return false;
        if (rule.operator === 'gt') return rawDate > cmpDate;
        if (rule.operator === 'gte') return rawDate >= cmpDate;
        if (rule.operator === 'lt') return rawDate < cmpDate;
        return rawDate <= cmpDate;
      }
      const a = toNumber(raw);
      const b = toNumber(rule.value);
      if (a === null || b === null) return false;
      if (rule.operator === 'gt') return a > b;
      if (rule.operator === 'gte') return a >= b;
      if (rule.operator === 'lt') return a < b;
      return a <= b;
    }
    default:
      return true;
  }
}

export function applyFilterRules<T>(
  rows: T[],
  rules: FilterRule[],
  columns: TableColumn<T>[],
): T[] {
  if (!rules.length) return rows;

  const colByKey = new Map(columns.map((c) => [c.key, c] as const));
  const clusters: FilterRule[][] = [];
  let current: FilterRule[] = [];

  for (const rule of rules) {
    if (rule.conjunction === 'or' && current.length > 0) {
      clusters.push(current);
      current = [rule];
    } else {
      current.push(rule);
    }
  }
  if (current.length > 0) clusters.push(current);

  return rows.filter((row) =>
    clusters.some((cluster) =>
      cluster.every((rule) => {
        if (!colByKey.has(rule.field)) return true;
        return evaluateRule(row, rule, colByKey);
      }),
    ),
  );
}

export function applySort<T>(
  rows: T[],
  sort: SortState | null,
  columns: TableColumn<T>[],
): T[] {
  if (!sort) return rows;

  const col = columns.find((c) => c.key === sort.key);
  if (!col?.sortable) return rows;

  const dir = sort.direction === 'asc' ? 1 : -1;
  const accessor =
    col.sortAccessor ??
    ((row: T) => (row as Record<string, unknown>)[col.key] as string | number | null);

  return [...rows].sort((a, b) => {
    const va = accessor(a);
    const vb = accessor(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (va instanceof Date || vb instanceof Date) {
      return ((va as Date).valueOf?.() ?? 0) >= ((vb as Date).valueOf?.() ?? 0) ? dir : -dir;
    }
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  });
}
