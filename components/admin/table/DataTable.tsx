'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { applyFilterRules, applySort } from '@/lib/admin/table/apply-filters';
import type { BulkAction, FilterRule, SortState, TableColumn } from '@/lib/admin/table/types';
import { BulkActionBar } from '@/components/admin/table/BulkActionBar';
import { ColumnChooser } from '@/components/admin/table/ColumnChooser';
import { FilterBar } from '@/components/admin/table/FilterBar';
import { cn } from '@/components/ui/cn';

type DataTableProps<T extends { id: string }> = {
  storageKey: string;
  rows: T[];
  columns: TableColumn<T>[];
  bulkActions?: BulkAction<T>[];
  emptyMessage?: string;
};

function defaultVisibleKeys<T>(columns: TableColumn<T>[]): string[] {
  return columns.filter((c) => !c.defaultHidden).map((c) => c.key);
}

export function DataTable<T extends { id: string }>({
  storageKey,
  rows,
  columns,
  bulkActions = [],
  emptyMessage = 'No rows match your filters.',
}: DataTableProps<T>) {
  const [filterRules, setFilterRules, filtersReady] = useLocalStorageState<FilterRule[]>(
    `${storageKey}.filters`,
    [],
  );
  const [sort, setSort, sortReady] = useLocalStorageState<SortState | null>(
    `${storageKey}.sort`,
    null,
  );
  const [visibleKeys, setVisibleKeys, columnsReady] = useLocalStorageState<string[]>(
    `${storageKey}.columns`,
    defaultVisibleKeys(columns),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!columnsReady) return;
    const defaults = defaultVisibleKeys(columns);
    const valid = visibleKeys.filter((k) => columns.some((c) => c.key === k));
    if (valid.length === 0) setVisibleKeys(defaults);
  }, [columns, columnsReady, setVisibleKeys, visibleKeys]);

  const visibleColumns = useMemo(
    () => columns.filter((c) => visibleKeys.includes(c.key)),
    [columns, visibleKeys],
  );

  const processedRows = useMemo(() => {
    if (!filtersReady || !sortReady) return rows;
    const filtered = applyFilterRules(rows, filterRules, columns);
    return applySort(filtered, sort, columns);
  }, [rows, filterRules, sort, columns, filtersReady, sortReady]);

  const allVisibleSelected =
    processedRows.length > 0 && processedRows.every((r) => selectedIds.has(r.id));

  const selectedRows = useMemo(
    () => rows.filter((r) => selectedIds.has(r.id)),
    [rows, selectedIds],
  );

  function toggleSort(key: string) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: 'asc' };
      if (current.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(processedRows.map((r) => r.id)));
  }

  const ready = filtersReady && sortReady && columnsReady;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <FilterBar columns={columns} rules={filterRules} onChange={setFilterRules} />
        </div>
        <ColumnChooser columns={columns} visibleKeys={visibleKeys} onChange={setVisibleKeys} />
      </div>

      {bulkActions.length > 0 && (
        <BulkActionBar
          selectedRows={selectedRows}
          actions={bulkActions}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900/80 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              {visibleColumns.map((col) => {
                const isSelect = col.key === 'select';
                const isSorted = sort?.key === col.key;

                return (
                  <th key={col.key} className={cn('px-4 py-3 font-medium', col.className)}>
                    {isSelect ? (
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAll}
                        aria-label="Select all rows"
                        className="rounded border-neutral-600 bg-neutral-900"
                      />
                    ) : col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-neutral-200"
                      >
                        {col.label}
                        {isSorted ? (
                          sort.direction === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {!ready ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Loading table preferences…
                </td>
              </tr>
            ) : processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedRows.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-900/50">
                  {visibleColumns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-neutral-200', col.className)}>
                      {col.key === 'select' ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          aria-label="Select row"
                          className="rounded border-neutral-600 bg-neutral-900"
                        />
                      ) : (
                        col.render(row)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-500">
        {ready ? `${processedRows.length} of ${rows.length} rows` : ''}
      </p>
    </div>
  );
}
