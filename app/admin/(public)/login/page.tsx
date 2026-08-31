import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/env';

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'This account is not authorized for CMS access.',
  config: 'Supabase is not configured. Add keys to .env.local first.',
  auth: 'Sign-in failed. Try again.',
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error } = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="mx-auto w-full max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-orange-400">Propagenda CMS</p>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-neutral-400">Admin access only.</p>
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {!supabaseReady ? (
        <p className="text-sm text-neutral-400">
          Set <code className="text-orange-300">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-orange-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{' '}
          <code className="text-orange-300">.env.local</code>, then restart the dev server.
        </p>
      ) : (
        <AdminLoginForm />
      )}
    </div>
  );
}
