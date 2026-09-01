import { ServiceEditorForm } from '@/components/admin/services/ServiceEditorForm';
import { emptyServiceEditorValues } from '@/lib/cms/services/form-state';
import {
  listAdminServiceHubCards,
  listAdminServices,
} from '@/lib/cms/repositories/admin/services';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export default async function NewServicePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">New service</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const [existing, hubCards] = await Promise.all([listAdminServices(), listAdminServiceHubCards()]);
  const nextSortOrder =
    existing.length > 0 ? Math.max(...existing.map((row) => row.sort_order)) + 1 : 0;

  const initialValues = {
    ...emptyServiceEditorValues(),
    sortOrder: nextSortOrder,
  };

  return <ServiceEditorForm mode="create" initialValues={initialValues} hubCards={hubCards} />;
}
