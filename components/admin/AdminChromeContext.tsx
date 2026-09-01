'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

export type AdminChromeState = {
  breadcrumbs?: AdminBreadcrumb[];
  badge?: ReactNode;
  actions?: ReactNode;
  /** Remove default content padding (full-bleed editors). */
  fullBleed?: boolean;
  /** Changes when toolbar UI must refresh (e.g. loading labels). */
  toolbarState?: string;
};

type AdminChromeContextValue = {
  chrome: AdminChromeState | null;
  setChrome: (chrome: AdminChromeState | null) => void;
};

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

function breadcrumbsKey(breadcrumbs?: AdminBreadcrumb[]) {
  return breadcrumbs?.map((item) => `${item.href ?? ''}:${item.label}`).join('|') ?? '';
}

function chromeSyncKey(config: AdminChromeState | null) {
  if (!config) return '';
  return [
    breadcrumbsKey(config.breadcrumbs),
    String(config.fullBleed ?? false),
    config.toolbarState ?? '',
  ].join('|');
}

export function AdminChromeProvider({ children }: { children: ReactNode }) {
  const [chrome, setChromeState] = useState<AdminChromeState | null>(null);

  const setChrome = useCallback((next: AdminChromeState | null) => {
    setChromeState((prev) => {
      if (chromeSyncKey(prev) === chromeSyncKey(next)) {
        if (prev === next) return prev;
        if (
          prev &&
          next &&
          prev.actions === next.actions &&
          prev.badge === next.badge
        ) {
          return prev;
        }
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ chrome, setChrome }), [chrome, setChrome]);

  return <AdminChromeContext.Provider value={value}>{children}</AdminChromeContext.Provider>;
}

export function useAdminChromeContext() {
  const context = useContext(AdminChromeContext);
  if (!context) {
    throw new Error('useAdminChromeContext must be used within AdminChromeProvider');
  }
  return context;
}

export function useAdminChrome(config: AdminChromeState | null) {
  const { setChrome } = useAdminChromeContext();
  const configRef = useRef(config);
  configRef.current = config;

  const syncKey = chromeSyncKey(config);

  useEffect(() => {
    setChrome(configRef.current);
    return () => setChrome(null);
  }, [syncKey, setChrome]);
}
