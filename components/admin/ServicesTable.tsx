'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { DataTable } from '@/components/admin/table/DataTable';
import { exportRowsToCsv } from '@/lib/admin/table/export-csv';
import type { BulkAction, TableColumn } from '@/lib/admin/table/types';
import type { ServiceListRow } from '@/types/cms';
import { deleteServices } from '@/app/admin/(protected)/services/actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ServicesTable({ rows }: { rows: ServiceListRow[] }) {
  const router = useRouter();

  const columns = useMemo<TableColumn<ServiceListRow>[]>(
    () => [
      { key: 'select', label: '', render: () => null },
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        filter: { kind: 'text' },
        render: (row) => (
          <Link
            href={`/admin/services/${row.slug}`}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            {row.title}
          </Link>
        ),
        exportCell: (row) => row.title,
      },
      {
        key: 'slug',
        label: 'Slug',
        sortable: true,
        filter: { kind: 'text' },
        render: (row) => (
          <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filter: {
          kind: 'enum',
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ],
        },
        render: (row) => (
          <Badge
            variant={row.status === 'published' ? 'default' : 'secondary'}
            className={cn(row.status === 'published' && 'bg-primary/15 text-primary')}
          >
            {row.status}
          </Badge>
        ),
      },
      {
        key: 'sort_order',
        label: 'Order',
        sortable: true,
        filter: { kind: 'number' },
        render: (row) => row.sort_order,
      },
      {
        key: 'updated_at',
        label: 'Updated',
        sortable: true,
        filter: { kind: 'date' },
        sortAccessor: (row) => new Date(row.updated_at),
        render: (row) => (
          <time dateTime={row.updated_at} className="text-muted-foreground">
            {formatDate(row.updated_at)}
          </time>
        ),
        exportCell: (row) => row.updated_at,
      },
    ],
    [],
  );

  const bulkActions = useMemo<BulkAction<ServiceListRow>[]>(
    () => [
      {
        id: 'copy-slugs',
        label: 'Copy slugs',
        run: async (selected) => {
          const text = selected.map((r) => r.slug).join('\n');
          await navigator.clipboard.writeText(text);
        },
      },
      {
        id: 'export',
        label: 'Export CSV',
        run: (selected) => {
          exportRowsToCsv({
            rows: selected,
            columns,
            filename: 'services-export.csv',
          });
        },
      },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        confirm: 'Confirm delete',
        run: async (selected) => {
          const result = await deleteServices(selected.map((r) => r.id));
          if (!result.ok) {
            window.alert(result.error);
            return;
          }
          router.refresh();
        },
      },
    ],
    [columns, router],
  );

  return (
    <DataTable
      storageKey="admin.services"
      rows={rows}
      columns={columns}
      bulkActions={bulkActions}
      emptyMessage="No services match your filters."
    />
  );
}
