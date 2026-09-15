import { CaseStudyEditorForm } from '@/components/admin/case-studies/CaseStudyEditorForm';
import { emptyCaseStudyEditorValues } from '@/lib/cms/case-studies/form-state';
import { listAdminCaseStudies } from '@/lib/cms/repositories/admin/caseStudies';
import { hasD1 } from '@/lib/d1/client';

export default async function NewCaseStudyPage() {
  if (!hasD1()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">New case study</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const existing = await listAdminCaseStudies();
  const nextSortOrder = existing.length > 0 ? Math.max(...existing.map((row) => row.sort_order)) + 1 : 0;

  const initialValues = {
    ...emptyCaseStudyEditorValues(),
    sortOrder: nextSortOrder,
  };

  return <CaseStudyEditorForm mode="create" initialValues={initialValues} />;
}
