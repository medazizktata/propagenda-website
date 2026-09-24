'use client';

import { useMemo, useState } from 'react';

/**
 * Client-side paging over an already-filtered list. `resetKey` identifies the current filter
 * set: whenever it changes the list goes back to page 1. The reset is stored (a state update
 * during render, React's derived-state pattern), so returning to an earlier filter set starts at
 * page 1 too rather than reviving the page it was left on.
 */
export function usePagination<T>(items: readonly T[], pageSize: number, resetKey: string) {
  const [state, setState] = useState({ key: resetKey, page: 1 });
  if (state.key !== resetKey) setState({ key: resetKey, page: 1 });
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(state.key === resetKey ? state.page : 1, pageCount);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return {
    page,
    pageCount,
    pageItems,
    /** 1-based index of the first item on this page (0 when the list is empty). */
    start: items.length === 0 ? 0 : (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, items.length),
    total: items.length,
    setPage: (next: number) =>
      setState({ key: resetKey, page: Math.min(Math.max(1, next), pageCount) }),
  };
}
