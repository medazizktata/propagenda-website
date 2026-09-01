import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CMS | Propagenda',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-cms min-h-dvh bg-surface text-foreground [&_main]:min-h-0 [&_main]:bg-surface">
      {children}
    </div>
  );
}
