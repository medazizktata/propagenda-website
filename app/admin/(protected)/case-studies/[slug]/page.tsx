import { notFound } from 'next/navigation';
import { CaseStudyEditorForm } from '@/components/admin/case-studies/CaseStudyEditorForm';
import { getAdminCaseStudyBySlug } from '@/lib/cms/repositories/admin/caseStudies';
import { caseStudyRowToEditorValues } from '@/lib/cms/case-studies/form-state';
import { hasD1 } from '@/lib/d1/client';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditCaseStudyPage({ params, searchParams }: Props) {
  if (!hasD1()) notFound();

  const { slug } = await params;
  const { saved } = await searchParams;
  const caseStudy = await getAdminCaseStudyBySlug(slug);

  if (!caseStudy) notFound();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {saved === '1' && (
        <p className="shrink-0 border-b border-primary/25 bg-accent/40 px-4 py-3 text-sm text-accent-foreground md:px-6">
          Changes saved.
        </p>
      )}
      <CaseStudyEditorForm
        mode="edit"
        caseStudyId={caseStudy.id}
        previousSlug={caseStudy.slug}
        initialValues={caseStudyRowToEditorValues(caseStudy)}
        status={caseStudy.status}
      />
    </div>
  );
}
