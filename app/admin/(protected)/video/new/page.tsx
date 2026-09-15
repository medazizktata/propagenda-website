import { VideoEditorForm } from '@/components/admin/video/VideoEditorForm';
import { emptyVideoEditorValues } from '@/lib/cms/video/form-state';
import { listAdminVideoProjects } from '@/lib/cms/repositories/admin/videoProjects';
import { hasD1 } from '@/lib/d1/client';

export default async function NewVideoPage() {
  if (!hasD1()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">New video</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const existing = await listAdminVideoProjects();
  const nextSortOrder = existing.length > 0 ? Math.max(...existing.map((row) => row.sort_order)) + 1 : 0;

  const initialValues = {
    ...emptyVideoEditorValues(),
    sortOrder: nextSortOrder,
  };

  return <VideoEditorForm mode="create" initialValues={initialValues} />;
}
