'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { DataTable } from '@/components/admin/table/DataTable';
import { TableActionsCell } from '@/components/admin/table/TableActionsCell';
import { exportRowsToCsv } from '@/lib/admin/table/export-csv';
import type { BulkAction, TableAction, TableColumn } from '@/lib/admin/table/types';
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

  const { columns, bulkActions } = useMemo(() => {
    const copySlugs = async (selected: ServiceListRow[]) => {
      await navigator.clipboard.writeText(selected.map((row) => row.slug).join('\n'));
    };

    const deleteItems = async (selected: ServiceListRow[]) => {
      const result = await deleteServices(selected.map((row) => row.id));
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    };

    const dataColumns: TableColumn<ServiceListRow>[] = [
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
    ];

    const exportColumns: TableColumn<ServiceListRow>[] = [
      { key: 'select', label: '', pinned: 'start', render: () => null },
      ...dataColumns,
    ];

    const exportCsv = (selected: ServiceListRow[]) => {
      exportRowsToCsv({
        rows: selected,
        columns: exportColumns,
        filename:
          selected.length === 1 ? `${selected[0]!.slug}.csv` : 'services-export.csv',
      });
    };

    const rowActions: TableAction<ServiceListRow>[] = [
      {
        id: 'edit',
        label: 'Edit',
        icon: <Pencil className="size-4" />,
        href: (row) => `/admin/services/${row.slug}`,
      },
      {
        id: 'copy-slug',
        label: 'Copy slug',
        icon: <Copy className="size-4" />,
        run: (row) => copySlugs([row]),
      },
      {
        id: 'export',
        label: 'Export CSV',
        icon: <Download className="size-4" />,
        run: (row) => exportCsv([row]),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Trash2 className="size-4" />,
        destructive: true,
        confirm: 'Delete?',
        run: (row) => deleteItems([row]),
      },
    ];

    const tableColumns: TableColumn<ServiceListRow>[] = [
      { key: 'select', label: '', pinned: 'start', render: () => null },
      ...dataColumns,
      {
        key: 'actions',
        label: '',
        pinned: 'end',
        className: 'w-[1%] text-right',
        render: (row) => <TableActionsCell row={row} actions={rowActions} />,
      },
    ];

    const bulk: BulkAction<ServiceListRow>[] = [
      { id: 'copy-slugs', label: 'Copy slugs', run: copySlugs },
      { id: 'export', label: 'Export CSV', run: exportCsv },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        confirm: 'Confirm delete',
        run: deleteItems,
      },
    ];

    return { columns: tableColumns, bulkActions: bulk };
  }, [router]);

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
