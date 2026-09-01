import type { ReactNode } from 'react';

export default function AdminPublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-6 py-12">
      {children}
    </div>
  );
}
