import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CMS | Propagenda',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-cms flex h-dvh min-h-0 flex-col overflow-hidden bg-charcoal text-foreground">
      {children}
    </div>
  );
}
