import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

      <Card className="w-full border-border/80 bg-card/95 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>Admin access only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
          <AdminLoginForm />
        </CardContent>
      </Card>

      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to website
      </Link>
    </div>
  );
}
