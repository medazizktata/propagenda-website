import type { ReactNode } from 'react';

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

export type FilterFieldKind = 'text' | 'number' | 'enum' | 'date';

export type FilterField = {
  key: string;
  label: string;
  kind: FilterFieldKind;
  options?: Array<{ value: string; label: string }>;
};

export type FilterRule = {
  id: string;
  field: string;
  operator: FilterOperator;
  value: unknown;
  conjunction?: 'and' | 'or';
};

export type SortState = {
  key: string;
  direction: 'asc' | 'desc';
};

export type TableColumn<T> = {
  key: string;
  label: ReactNode;
  filter?: Omit<FilterField, 'key' | 'label'> & {
    accessor?: (row: T) => unknown;
  };
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number | Date | null | undefined;
  className?: string;
  defaultHidden?: boolean;
  render: (row: T) => ReactNode;
  exportCell?: (row: T) => string;
};

export type BulkAction<T> = {
  id: string;
  label: string;
  destructive?: boolean;
  confirm?: string;
  isDisabled?: (rows: T[]) => boolean;
  run: (rows: T[]) => void | Promise<void>;
};
