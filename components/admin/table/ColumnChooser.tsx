'use client';

import { Columns3 } from 'lucide-react';
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

  function toggle(key: string) {
    if (visibleKeys.includes(key)) {
      onChange(visibleKeys.filter((k) => k !== key));
      return;
    }
    onChange([...visibleKeys, key]);
  }

  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-pill bg-black px-4 py-2 text-xs font-bold uppercase text-white">
            <Columns3 className="size-3.5" aria-hidden />
            Columns
          </span>
        </summary>
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-neutral-800 bg-neutral-950 p-2 shadow-xl">
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Visible columns
          </p>
          <ul className="max-h-64 space-y-0.5 overflow-y-auto">
            {toggleable.map((col) => {
              const checked = visibleKeys.includes(col.key);
              return (
                <li key={col.key}>
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(col.key)}
                      className="rounded border-neutral-600 bg-neutral-900"
                    />
                    <span>{typeof col.label === 'string' ? col.label : col.key}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </div>
  );
}
