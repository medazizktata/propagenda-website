import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdminSession } from '@/lib/cms/auth';
import { signOut } from '@/app/admin/(protected)/actions';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdminSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <p className="font-mono text-xs uppercase tracking-widest text-orange-400">Propagenda CMS</p>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-neutral-400 sm:inline">{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-neutral-300 underline-offset-4 hover:text-white hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-neutral-800 md:block">
          <AdminNav />
        </aside>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
