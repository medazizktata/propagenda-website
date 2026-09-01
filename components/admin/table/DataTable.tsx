'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { applyFilterRules, applySort } from '@/lib/admin/table/apply-filters';
import type { BulkAction, FilterRule, SortState, TableColumn } from '@/lib/admin/table/types';
import { BulkActionBar } from '@/components/admin/table/BulkActionBar';
import { ColumnChooser } from '@/components/admin/table/ColumnChooser';
import { FilterBar } from '@/components/admin/table/FilterBar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {visibleColumns.map((col) => {
                const isSelect = col.key === 'select';
                const isSorted = sort?.key === col.key;

                return (
                  <TableHead key={col.key} className={col.className}>
                    {isSelect ? (
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAll}
                        aria-label="Select all rows"
                        className="size-4 rounded border-input accent-primary"
                      />
                    ) : col.sortable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 px-2 font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSort(col.key)}
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
                      </Button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ready ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading table preferences…
                </TableCell>
              </TableRow>
            ) : processedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              processedRows.map((row) => (
                <TableRow key={row.id} data-state={selectedIds.has(row.id) ? 'selected' : undefined}>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.key} className={cn(col.className)}>
                      {col.key === 'select' ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          aria-label="Select row"
                          className="size-4 rounded border-input accent-primary"
                        />
                      ) : (
                        col.render(row)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {ready ? `${processedRows.length} of ${rows.length} rows` : ''}
      </p>
    </div>
  );
}
