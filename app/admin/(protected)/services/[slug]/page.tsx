import { notFound } from 'next/navigation';
import { ServiceEditorForm } from '@/components/admin/services/ServiceEditorForm';
import {
  getAdminServiceBySlug,
  listAdminServiceHubCards,
} from '@/lib/cms/repositories/admin/services';
import { serviceRowToEditorValues } from '@/lib/cms/services/form-state';
import { isSupabaseConfigured } from '@/lib/supabase/env';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditServicePage({ params, searchParams }: Props) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const { saved } = await searchParams;
  const [service, hubCards] = await Promise.all([
    getAdminServiceBySlug(slug),
    listAdminServiceHubCards(),
  ]);

  if (!service) notFound();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {saved === '1' && (
        <p className="shrink-0 border-b border-primary/25 bg-accent/40 px-4 py-3 text-sm text-accent-foreground md:px-6">
          Changes saved.
        </p>
      )}
      <ServiceEditorForm
        mode="edit"
        serviceId={service.id}
        previousSlug={service.slug}
        initialValues={serviceRowToEditorValues(service)}
        status={service.status}
        hubCards={hubCards}
      />
    </div>
  );
}
