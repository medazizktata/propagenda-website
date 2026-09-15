import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminSection';
import { CaseStudiesTable } from '@/components/admin/CaseStudiesTable';
import { buttonVariants } from '@/components/ui/button';
import { hasD1 } from '@/lib/d1/client';
import { listAdminCaseStudies } from '@/lib/cms/repositories/admin/caseStudies';
import { cn } from '@/lib/utils';

export default async function AdminCaseStudiesPage() {
  if (!hasD1()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Case studies</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const caseStudies = await listAdminCaseStudies();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Case studies"
        description={`${caseStudies.length} total · filter, sort, and bulk actions persist in localStorage`}
        actions={
          <Link href="/admin/case-studies/new" className={cn(buttonVariants({ size: 'sm' }))}>
            New case study
          </Link>
        }
      />
      <CaseStudiesTable rows={caseStudies} />
    </div>
  );
}
