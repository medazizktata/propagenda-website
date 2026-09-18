'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminFormField, AdminFormRow } from '@/components/admin/AdminFormField';
import { AdminImageField } from '@/components/admin/AdminImageField';
import { JsonFieldEditor } from '@/components/admin/JsonFieldEditor';
import { LinesListEditor } from '@/components/admin/services/LinesListEditor';
import {
  createCaseStudy,
  updateCaseStudy,
} from '@/app/admin/(protected)/case-studies/actions';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CaseStudyEditorInput } from '@/lib/cms/case-studies/schema';
import type { ContentStatus } from '@/types/cms';

type TabId = 'content' | 'story' | 'seo' | 'advanced';
const TABS: { id: TabId; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'story', label: 'Story' },
  { id: 'seo', label: 'SEO' },
  { id: 'advanced', label: 'Advanced' },
];

type CaseStudyEditorFormProps = {
  mode: 'create' | 'edit';
  caseStudyId?: string;
  previousSlug?: string;
  initialValues: CaseStudyEditorInput;
  status?: ContentStatus;
};

export function CaseStudyEditorForm({
  mode,
  caseStudyId,
  previousSlug,
  initialValues,
  status = 'draft',
}: CaseStudyEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'save' | 'publish' | 'draft' | null>(null);

  function setField<K extends keyof CaseStudyEditorInput>(key: K, value: CaseStudyEditorInput[K]) {
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
          ? await createCaseStudy(formData)
          : await updateCaseStudy(caseStudyId!, previousSlug ?? values.slug, formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (mode === 'create' || result.slug !== previousSlug) {
        router.replace(`/admin/case-studies/${result.slug}?saved=1`);
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

      <div className="shrink-0 border-b border-white/12 px-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <nav className="-mb-px flex gap-5 overflow-x-auto" aria-label="Editor sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'shrink-0 border-b-2 pb-3 pt-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-orange text-white'
                    : 'border-transparent text-white/65 hover:border-white/20 hover:text-white',
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2 pb-2 sm:justify-end">
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
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {activeTab === 'content' && (
            <>
              <AdminFormField label="Slug" htmlFor="slug" hint="Lowercase letters, numbers, hyphens">
                <Input
                  id="slug"
                  value={values.slug}
                  onChange={(e) => setField('slug', e.target.value)}
                  placeholder="sealand"
                  disabled={mode === 'edit' && status === 'published'}
                  className="admin-field h-10"
                />
              </AdminFormField>
              <AdminFormRow>
                <AdminFormField label="Title" htmlFor="title">
                  <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="H1" htmlFor="h1">
                  <Input id="h1" value={values.h1} onChange={(e) => setField('h1', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
              </AdminFormRow>
              <AdminFormRow>
                <AdminFormField label="Category" htmlFor="category" hint="e.g. Automotive, Hospitality">
                  <Input id="category" value={values.category} onChange={(e) => setField('category', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="Tier" htmlFor="tier">
                  <Select value={values.tier} onValueChange={(v) => setField('tier', v as CaseStudyEditorInput['tier'])}>
                    <SelectTrigger id="tier" className="admin-field h-10 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="more">More</SelectItem>
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </AdminFormRow>
              <AdminFormField label="Sort order" htmlFor="sortOrder">
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  value={values.sortOrder}
                  onChange={(e) => setField('sortOrder', Number(e.target.value))}
                  className="admin-field h-10 max-w-[140px]"
                />
              </AdminFormField>
              <AdminFormField label="Overview" htmlFor="overview">
                <Textarea id="overview" rows={6} value={values.overview} onChange={(e) => setField('overview', e.target.value)} className="admin-field min-h-[140px]" />
              </AdminFormField>
              <AdminFormField label="Scope items" htmlFor="scopeItems">
                <LinesListEditor id="scopeItems" value={values.scopeItemsText} onChange={(t) => setField('scopeItemsText', t)} placeholder="Scope item" />
              </AdminFormField>
              <AdminFormRow>
                <AdminFormField label="Client" htmlFor="client">
                  <Input id="client" value={values.client} onChange={(e) => setField('client', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="Industry" htmlFor="industry">
                  <Input id="industry" value={values.industry} onChange={(e) => setField('industry', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="Year" htmlFor="year">
                  <Input id="year" value={values.year} onChange={(e) => setField('year', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
              </AdminFormRow>
              <AdminFormField label="Hero image" htmlFor="heroImage">
                <AdminImageField id="heroImage" value={values.heroImage} onChange={(next) => setField('heroImage', next)} />
              </AdminFormField>
              <AdminFormField label="Deliverables" htmlFor="deliverables">
                <LinesListEditor id="deliverables" value={values.deliverablesText} onChange={(t) => setField('deliverablesText', t)} placeholder="Deliverable" />
              </AdminFormField>
            </>
          )}

          {activeTab === 'story' && (
            <>
              <AdminFormField label="Challenge" htmlFor="challenge">
                <Textarea id="challenge" rows={5} value={values.challenge} onChange={(e) => setField('challenge', e.target.value)} className="admin-field min-h-[120px]" />
              </AdminFormField>
              <AdminFormField label="Approach" htmlFor="approach">
                <Textarea id="approach" rows={5} value={values.approach} onChange={(e) => setField('approach', e.target.value)} className="admin-field min-h-[120px]" />
              </AdminFormField>
              <AdminFormField label="Outcome" htmlFor="outcome">
                <Textarea id="outcome" rows={5} value={values.outcome} onChange={(e) => setField('outcome', e.target.value)} className="admin-field min-h-[120px]" />
              </AdminFormField>
              <AdminFormRow>
                <AdminFormField label="Quote" htmlFor="quoteText">
                  <Textarea id="quoteText" rows={3} value={values.quoteText} onChange={(e) => setField('quoteText', e.target.value)} className="admin-field" />
                </AdminFormField>
                <AdminFormField label="Quote author" htmlFor="quoteAuthor">
                  <Input id="quoteAuthor" value={values.quoteAuthor} onChange={(e) => setField('quoteAuthor', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
              </AdminFormRow>
            </>
          )}

          {activeTab === 'seo' && (
            <>
              <AdminFormField label="Meta title" htmlFor="seoTitle">
                <Input id="seoTitle" value={values.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} className="admin-field h-10" />
              </AdminFormField>
              <AdminFormField label="Meta description" htmlFor="seoDescription">
                <Textarea id="seoDescription" rows={5} value={values.seoDescription} onChange={(e) => setField('seoDescription', e.target.value)} className="admin-field min-h-[120px]" />
              </AdminFormField>
              <AdminFormField label="OG image" htmlFor="seoImage" hint="Social share image">
                <AdminImageField id="seoImage" value={values.seoImage} onChange={(next) => setField('seoImage', next)} />
              </AdminFormField>
            </>
          )}

          {activeTab === 'advanced' && (
            <>
              <AdminFormRow>
                <AdminFormField label="Accent color" htmlFor="accentColor" hint="Hex, e.g. #baa58d">
                  <Input id="accentColor" value={values.accentColor} onChange={(e) => setField('accentColor', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="Accent on-color" htmlFor="accentOnColor" hint="Text/marks on the accent fill">
                  <Input id="accentOnColor" value={values.accentOnColor} onChange={(e) => setField('accentOnColor', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
              </AdminFormRow>
              <AdminFormRow>
                <AdminFormField label="Prev slug" htmlFor="prevSlug">
                  <Input id="prevSlug" value={values.prevSlug} onChange={(e) => setField('prevSlug', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
                <AdminFormField label="Next slug" htmlFor="nextSlug">
                  <Input id="nextSlug" value={values.nextSlug} onChange={(e) => setField('nextSlug', e.target.value)} className="admin-field h-10" />
                </AdminFormField>
              </AdminFormRow>
              <JsonFieldEditor
                id="galleryJson"
                label="Gallery"
                hint="Array of { src, alt, width, height }"
                value={values.galleryJson}
                onChange={(next) => setField('galleryJson', next)}
                emptyFallback="[]"
                rows={10}
              />
              <JsonFieldEditor
                id="resultsJson"
                label="Results"
                hint="Array of { label, value } — leave empty to hide"
                value={values.resultsJson}
                onChange={(next) => setField('resultsJson', next)}
                emptyFallback=""
                rows={8}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
