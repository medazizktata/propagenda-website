import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminIdentity } from '@/lib/cms/auth';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { email } = await requireAdminIdentity();

  return <AdminShell userEmail={email}>{children}</AdminShell>;
}
