import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage services, case studies, and video work from the sidebar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink href="/admin/services" title="Services" detail="Browse and manage service pages" />
      </div>
    </div>
  );
}

function QuickLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:border-primary/30 hover:bg-muted/20">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{detail}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
