import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminSession } from '@/lib/cms/auth';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdminSession();

  return <AdminShell userEmail={user.email ?? ''}>{children}</AdminShell>;
}
