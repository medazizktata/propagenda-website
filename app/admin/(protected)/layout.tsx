import type { ReactNode } from 'react';
import { requireAdminSession } from '@/lib/cms/auth';
import { signOut } from '@/app/admin/(protected)/actions';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdminSession();

  return (
    <>
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
      <main className="px-6 py-8">{children}</main>
    </>
  );
}
