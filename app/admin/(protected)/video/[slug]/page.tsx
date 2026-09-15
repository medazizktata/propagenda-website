import { notFound } from 'next/navigation';
import { VideoEditorForm } from '@/components/admin/video/VideoEditorForm';
import { getAdminVideoProjectBySlug } from '@/lib/cms/repositories/admin/videoProjects';
import { videoRowToEditorValues } from '@/lib/cms/video/form-state';
import { hasD1 } from '@/lib/d1/client';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditVideoPage({ params, searchParams }: Props) {
  if (!hasD1()) notFound();

  const { slug } = await params;
  const { saved } = await searchParams;
  const video = await getAdminVideoProjectBySlug(slug);

  if (!video) notFound();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {saved === '1' && (
        <p className="shrink-0 border-b border-primary/25 bg-accent/40 px-4 py-3 text-sm text-accent-foreground md:px-6">
          Changes saved.
        </p>
      )}
      <VideoEditorForm
        mode="edit"
        videoId={video.id}
        previousSlug={video.slug}
        initialValues={videoRowToEditorValues(video)}
        status={video.status}
      />
    </div>
  );
}
