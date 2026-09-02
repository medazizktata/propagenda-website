import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminSection';
import { ServicesTable } from '@/components/admin/ServicesTable';
import { buttonVariants } from '@/components/ui/button';
import { listAdminServices } from '@/lib/cms/repositories/admin/services';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { cn } from '@/lib/utils';

export default async function AdminServicesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const services = await listAdminServices();

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Services"
        description={`${services.length} total · filter, sort, and bulk actions persist in localStorage`}
        actions={
          <Link
            href="/admin/services/new"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            New service
          </Link>
        }
      />

      <ServicesTable rows={services} />
    </div>
  );
}
