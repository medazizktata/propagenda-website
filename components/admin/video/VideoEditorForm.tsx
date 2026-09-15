'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminFormField, AdminFormRow } from '@/components/admin/AdminFormField';
import { AdminImageField } from '@/components/admin/AdminImageField';
import {
  createVideoProject,
  updateVideoProject,
} from '@/app/admin/(protected)/video/actions';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { VideoEditorInput } from '@/lib/cms/video/schema';
import type { ContentStatus } from '@/types/cms';

type VideoEditorFormProps = {
  mode: 'create' | 'edit';
  videoId?: string;
  previousSlug?: string;
  initialValues: VideoEditorInput;
  status?: ContentStatus;
};

export function VideoEditorForm({
  mode,
  videoId,
  previousSlug,
  initialValues,
  status = 'draft',
}: VideoEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'save' | 'publish' | 'draft' | null>(null);

  function setField<K extends keyof VideoEditorInput>(key: K, value: VideoEditorInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(intent: 'save' | 'publish' | 'draft') {
    setError(null);
    setLoading(intent);

    const formData = new FormData();
    formData.set('intent', intent);
    for (const [key, value] of Object.entries(values)) {
      formData.set(key, String(value));
    }

    try {
      const result =
        mode === 'create'
          ? await createVideoProject(formData)
          : await updateVideoProject(videoId!, previousSlug ?? values.slug, formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (mode === 'create' || result.slug !== previousSlug) {
        router.replace(`/admin/video/${result.slug}?saved=1`);
        return;
      }

      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const busy = loading !== null;

  return (
    <div className="admin-editor flex min-h-0 flex-1 flex-col">
      {error && (
        <p className="shrink-0 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive md:px-6">
          {error}
        </p>
      )}

      <div className="shrink-0 border-b border-white/12 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge variant={status === 'published' ? 'default' : 'outline'}>{status}</Badge>
          <Button type="button" size="sm" onClick={() => submit('save')} disabled={busy}>
            {loading === 'save' ? 'Saving…' : 'Save'}
          </Button>
          {status === 'draft' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/8"
              onClick={() => submit('publish')}
              disabled={busy}
            >
              {loading === 'publish' ? 'Publishing…' : 'Publish'}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/8"
              onClick={() => submit('draft')}
              disabled={busy}
            >
              {loading === 'draft' ? 'Unpublishing…' : 'Unpublish'}
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <AdminFormField label="Slug" htmlFor="slug" hint="Lowercase letters, numbers, hyphens">
            <Input
              id="slug"
              value={values.slug}
              onChange={(e) => setField('slug', e.target.value)}
              placeholder="showreel-marketing"
              disabled={mode === 'edit' && status === 'published'}
              className="admin-field h-10 font-mono"
            />
          </AdminFormField>
          <AdminFormRow>
            <AdminFormField label="Title" htmlFor="title">
              <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} className="admin-field h-10" />
            </AdminFormField>
            <AdminFormField label="Category" htmlFor="category">
              <Input id="category" value={values.category} onChange={(e) => setField('category', e.target.value)} className="admin-field h-10" />
            </AdminFormField>
          </AdminFormRow>
          <AdminFormField label="Video (R2 key or path)" htmlFor="src" hint="Relative R2 object key, e.g. videos/showreel.mp4 -- blank for image-only placeholder">
            <Input id="src" value={values.src} onChange={(e) => setField('src', e.target.value)} className="admin-field h-10 font-mono" />
          </AdminFormField>
          <AdminFormField label="Poster" htmlFor="poster">
            <AdminImageField id="poster" value={values.poster} onChange={(next) => setField('poster', next)} />
          </AdminFormField>
          <AdminFormRow>
            <AdminFormField label="Orientation" htmlFor="orientation">
              <Select value={values.orientation} onValueChange={(v) => setField('orientation', v as VideoEditorInput['orientation'])}>
                <SelectTrigger id="orientation" className="admin-field h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                </SelectContent>
              </Select>
            </AdminFormField>
            <AdminFormField label="Width" htmlFor="width">
              <Input id="width" type="number" min={1} value={values.width} onChange={(e) => setField('width', Number(e.target.value))} className="admin-field h-10" />
            </AdminFormField>
            <AdminFormField label="Height" htmlFor="height">
              <Input id="height" type="number" min={1} value={values.height} onChange={(e) => setField('height', Number(e.target.value))} className="admin-field h-10" />
            </AdminFormField>
          </AdminFormRow>
          <AdminFormRow>
            <AdminFormField label="Duration" htmlFor="duration" hint="e.g. 0:32">
              <Input id="duration" value={values.duration} onChange={(e) => setField('duration', e.target.value)} className="admin-field h-10" />
            </AdminFormField>
            <AdminFormField label="Client" htmlFor="client">
              <Input id="client" value={values.client} onChange={(e) => setField('client', e.target.value)} className="admin-field h-10" />
            </AdminFormField>
            <AdminFormField label="Sort order" htmlFor="sortOrder">
              <Input id="sortOrder" type="number" min={0} value={values.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value))} className="admin-field h-10" />
            </AdminFormField>
          </AdminFormRow>
          <AdminFormField label="Description" htmlFor="description">
            <Textarea id="description" rows={4} value={values.description} onChange={(e) => setField('description', e.target.value)} className="admin-field min-h-[100px]" />
          </AdminFormField>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={values.isShowreel}
                onChange={(e) => setField('isShowreel', e.target.checked)}
                className="size-4 rounded border-input accent-primary"
              />
              Is showreel (the one featured video)
            </label>
            <label className="flex items-center gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={values.placeholder}
                onChange={(e) => setField('placeholder', e.target.checked)}
                className="size-4 rounded border-input accent-primary"
              />
              Placeholder (image-only, no real video)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
