import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminSection';
import { VideoProjectsTable } from '@/components/admin/VideoProjectsTable';
import { buttonVariants } from '@/components/ui/button';
import { hasD1 } from '@/lib/d1/client';
import { listAdminVideoProjects } from '@/lib/cms/repositories/admin/videoProjects';
import { cn } from '@/lib/utils';

export default async function AdminVideoPage() {
  if (!hasD1()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Video work</h1>
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </div>
    );
  }

  const videos = await listAdminVideoProjects();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Video work"
        description={`${videos.length} total · filter, sort, and bulk actions persist in localStorage`}
        actions={
          <Link href="/admin/video/new" className={cn(buttonVariants({ size: 'sm' }))}>
            New video
          </Link>
        }
      />
      <VideoProjectsTable rows={videos} />
    </div>
  );
}
