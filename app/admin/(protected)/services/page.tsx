import { Button } from '@/components/ui/Button';
import { ServicesTable } from '@/components/admin/ServicesTable';
import { listAdminServices } from '@/lib/cms/repositories/admin/services';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export default async function AdminServicesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <p className="text-sm text-neutral-400">
          Set Supabase env vars, then run <code className="text-orange-300">pnpm db:reset</code>.
        </p>
      </div>
    );
  }

  const services = await listAdminServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {services.length} total · filter, sort, and bulk actions persist in localStorage
          </p>
        </div>
        <Button href="/admin/services/new" size="sm" variant="primary">
          New service
        </Button>
      </div>

      <ServicesTable rows={services} />
    </div>
  );
}
