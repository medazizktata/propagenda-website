'use client';

import { useCallback, useEffect, useState } from 'react';

export function usePersistedFlag(storageKey: string, defaultValue = false) {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) setValue(stored === '1');
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  const setFlag = useCallback(
    (next: boolean | ((current: boolean) => boolean)) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        try {
          localStorage.setItem(storageKey, resolved ? '1' : '0');
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [storageKey],
  );

  return [value, setFlag, hydrated] as const;
}
