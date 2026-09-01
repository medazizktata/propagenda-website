'use client';

import { Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TableColumn } from '@/lib/admin/table/types';

export function ColumnChooser<T>({
  columns,
  visibleKeys,
  onChange,
}: {
  columns: TableColumn<T>[];
  visibleKeys: string[];
  onChange: (keys: string[]) => void;
}) {
  const toggleable = columns.filter((c) => c.key !== 'select');

  function toggle(key: string, checked: boolean) {
    if (!checked) {
      onChange(visibleKeys.filter((k) => k !== key));
      return;
    }
    onChange([...visibleKeys, key]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <Columns3 className="size-3.5" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        {toggleable.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={visibleKeys.includes(col.key)}
            onCheckedChange={(checked) => toggle(col.key, checked === true)}
          >
            {typeof col.label === 'string' ? col.label : col.key}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
