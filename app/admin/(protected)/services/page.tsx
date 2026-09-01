import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ServicesTable } from '@/components/admin/ServicesTable';
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {services.length} total · filter, sort, and bulk actions persist in localStorage
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          New service
        </Link>
      </div>

      <ServicesTable rows={services} />
    </div>
  );
}
