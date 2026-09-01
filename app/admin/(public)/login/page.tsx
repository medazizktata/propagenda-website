import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminFlatPanel } from '@/components/admin/AdminSection';
import { Badge } from '@/components/ui/badge';

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'This account is not authorized for CMS access.',
  config: 'Sign-in is temporarily unavailable. Try again later.',
  auth: 'Sign-in failed. Check your email and password.',
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo href="/" variant="horizontal" />
        <Badge variant="outline" className="border-primary/30 bg-accent text-accent-foreground">
          CMS
        </Badge>
      </div>

      <AdminFlatPanel className="w-full space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Sign in</h1>
          <p className="mt-1 text-sm text-white/65">Admin access only.</p>
        </div>

        {errorMessage && (
          <p
            className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        <AdminLoginForm />
      </AdminFlatPanel>

      <Link
        href="/"
        className="text-sm text-white/65 transition-colors hover:text-orange"
      >
        ← Back to website
      </Link>
    </div>
  );
}
