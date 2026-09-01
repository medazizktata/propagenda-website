'use client';

import { useRouter } from 'next/navigation';
import { ServiceEditorToolbar, type ServiceEditorTabId } from '@/components/admin/services/ServiceEditorToolbar';
import { useMemo, useState } from 'react';
import { AdminFormField, AdminFormRow } from '@/components/admin/AdminFormField';
import { AdminImageField } from '@/components/admin/AdminImageField';
import { JsonFieldEditor } from '@/components/admin/JsonFieldEditor';
import { usePersistedFlag } from '@/lib/cms/admin/use-persisted-flag';
import { prettyJsonString } from '@/lib/cms/services/json-fields';
import { createService, updateService } from '@/app/admin/(protected)/services/actions';
import { useAdminChrome } from '@/components/admin/AdminChromeContext';
import { LinesListEditor } from '@/components/admin/services/LinesListEditor';
import {
  GalleryEditor,
  RelatedWorkEditor,
  TertiaryCtaEditor,
  TiersEditor,
} from '@/components/admin/services/ServiceAdvancedFields';
import { ServicePreviewDock } from '@/components/admin/services/ServicePreviewDock';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ServiceEditorInput } from '@/lib/cms/services/schema';
import type { ServiceHubCard } from '@/content/servicesHub';
import type { ContentStatus } from '@/types/cms';

type TabId = ServiceEditorTabId;

type ServiceEditorFormProps = {
  mode: 'create' | 'edit';
  serviceId?: string;
  previousSlug?: string;
  initialValues: ServiceEditorInput;
  status?: ContentStatus;
  hubCards: ServiceHubCard[];
};

const ADVANCED_JSON_FIELDS: {
  key: keyof Pick<
    ServiceEditorInput,
    'galleryJson' | 'tiersJson' | 'relatedWorkJson' | 'tertiaryCtaJson'
  >;
  label: string;
  hint: string;
  emptyFallback: string;
  rows?: number;
}[] = [
  {
    key: 'galleryJson',
    label: 'Gallery',
    hint: 'Array of { src, alt, width, height }',
    emptyFallback: '[]',
    rows: 10,
  },
  {
    key: 'tiersJson',
    label: 'Pricing tiers',
    hint: 'Array of { name, items[] } — leave empty to hide',
    emptyFallback: '',
    rows: 10,
  },
  {
    key: 'relatedWorkJson',
    label: 'Related work',
    hint: 'Array of { label, href } — leave empty to hide',
    emptyFallback: '',
    rows: 8,
  },
  {
    key: 'tertiaryCtaJson',
    label: 'Tertiary CTA',
    hint: '{ label, href } — leave empty to hide',
    emptyFallback: '',
    rows: 4,
  },
];

const JSON_MODE_STORAGE_KEY = 'propagenda:admin:service-editor:json-mode';

export function ServiceEditorForm({
  mode,
  serviceId,
  previousSlug,
  initialValues,
  status = 'draft',
  hubCards,
}: ServiceEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jsonMode, setJsonMode, jsonModeHydrated] = usePersistedFlag(JSON_MODE_STORAGE_KEY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'save' | 'publish' | 'draft' | null>(null);

  function toggleJsonMode() {
    setJsonMode((current) => {
      const next = !current;
      if (next) {
        setValues((state) => ({
          ...state,
          galleryJson: prettyJsonString(state.galleryJson, '[]'),
          tiersJson: prettyJsonString(state.tiersJson, ''),
          relatedWorkJson: prettyJsonString(state.relatedWorkJson, ''),
          tertiaryCtaJson: prettyJsonString(state.tertiaryCtaJson, ''),
        }));
      }
      return next;
    });
  }

  function setField<K extends keyof ServiceEditorInput>(key: K, value: ServiceEditorInput[K]) {
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
          ? await createService(formData)
          : await updateService(serviceId!, previousSlug ?? values.slug, formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (mode === 'create') {
        router.replace(`/admin/services/${result.slug}?saved=1`);
        return;
      }

      if (result.slug !== previousSlug) {
        router.replace(`/admin/services/${result.slug}?saved=1`);
        return;
      }

      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  useAdminChrome(
    useMemo(
      () => ({
        fullBleed: true,
        toolbarState: `${loading ?? 'idle'}|${previewOpen ? 'preview' : 'edit'}|${activeTab}`,
        breadcrumbs: [
          { label: 'Services', href: '/admin/services' },
          {
            label:
              mode === 'create'
                ? 'New service'
                : values.title || previousSlug || 'Edit service',
          },
        ],
      }),
      [loading, mode, values.title, previousSlug, previewOpen, activeTab],
    ),
  );

  return (
    <div className="admin-editor flex min-h-0 flex-1 flex-col">
      {error && (
        <p className="shrink-0 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive md:px-6">
          {error}
        </p>
      )}

      <ServicePreviewDock
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        values={values}
        hubCards={hubCards}
      >
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ServiceEditorToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mode={mode}
            status={status}
            previewOpen={previewOpen}
            onPreviewToggle={() => setPreviewOpen((current) => !current)}
            loading={loading}
            onSave={() => submit('save')}
            onPublish={() => submit('publish')}
            onUnpublish={() => submit('draft')}
            jsonMode={jsonMode}
            onJsonModeToggle={toggleJsonMode}
            jsonModeReady={jsonModeHydrated}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-6">
              {activeTab === 'content' && (
                <>
                  <AdminFormField label="Slug" htmlFor="slug" hint="Lowercase letters, numbers, hyphens">
                    <Input
                      id="slug"
                      value={values.slug}
                      onChange={(e) => setField('slug', e.target.value)}
                      placeholder="branding-visual-identity"
                      disabled={mode === 'edit' && status === 'published'}
                      className="admin-field h-10 font-mono"
                    />
                  </AdminFormField>
                  <AdminFormRow>
                    <AdminFormField label="Title" htmlFor="title">
                      <Input
                        id="title"
                        value={values.title}
                        onChange={(e) => setField('title', e.target.value)}
                        className="admin-field h-10"
                      />
                    </AdminFormField>
                    <AdminFormField label="H1" htmlFor="h1">
                      <Input
                        id="h1"
                        value={values.h1}
                        onChange={(e) => setField('h1', e.target.value)}
                        className="admin-field h-10"
                      />
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
                    <Textarea
                      id="overview"
                      rows={8}
                      value={values.overview}
                      onChange={(e) => setField('overview', e.target.value)}
                      className="admin-field min-h-[180px]"
                    />
                  </AdminFormField>
                  <AdminFormField label="Scope items" htmlFor="scopeItems">
                    <LinesListEditor
                      id="scopeItems"
                      value={values.scopeItemsText}
                      onChange={(text) => setField('scopeItemsText', text)}
                      placeholder="Scope item"
                    />
                  </AdminFormField>
                </>
              )}

              {activeTab === 'seo' && (
                <>
                  <AdminFormField label="Meta title" htmlFor="seoTitle">
                    <Input
                      id="seoTitle"
                      value={values.seoTitle}
                      onChange={(e) => setField('seoTitle', e.target.value)}
                      className="admin-field h-10"
                    />
                  </AdminFormField>
                  <AdminFormField label="Meta description" htmlFor="seoDescription">
                    <Textarea
                      id="seoDescription"
                      rows={5}
                      value={values.seoDescription}
                      onChange={(e) => setField('seoDescription', e.target.value)}
                      className="admin-field min-h-[120px]"
                    />
                  </AdminFormField>
                  <AdminFormField label="OG image" htmlFor="seoImage" hint="Social share image">
                    <AdminImageField
                      id="seoImage"
                      value={values.seoImage}
                      onChange={(next) => setField('seoImage', next)}
                    />
                  </AdminFormField>
                </>
              )}

              {activeTab === 'hub' && (
                <>
                  <AdminFormField label="Hub image" htmlFor="hubImage">
                    <AdminImageField
                      id="hubImage"
                      value={values.hubImage}
                      onChange={(next) => setField('hubImage', next)}
                    />
                  </AdminFormField>
                  <AdminFormRow>
                    <AdminFormField label="Discipline tag" htmlFor="hubTag">
                      <Select
                        value={values.hubTag}
                        onValueChange={(value) =>
                          setField('hubTag', value as ServiceEditorInput['hubTag'])
                        }
                      >
                        <SelectTrigger id="hubTag" className="admin-field h-10 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brand">Brand</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="experience">Experience</SelectItem>
                        </SelectContent>
                      </Select>
                    </AdminFormField>
                    <AdminFormField label="Descriptor" htmlFor="hubDescriptor">
                      <Input
                        id="hubDescriptor"
                        value={values.hubDescriptor}
                        onChange={(e) => setField('hubDescriptor', e.target.value)}
                        className="admin-field h-10"
                      />
                    </AdminFormField>
                  </AdminFormRow>
                  <AdminFormField label="Preview image" htmlFor="hubPreview">
                    <AdminImageField
                      id="hubPreview"
                      value={values.hubPreview}
                      onChange={(next) => setField('hubPreview', next)}
                    />
                  </AdminFormField>
                  <AdminFormField label="Sub bullets" htmlFor="hubSubBullets">
                    <LinesListEditor
                      id="hubSubBullets"
                      value={values.hubSubBulletsText}
                      onChange={(text) => setField('hubSubBulletsText', text)}
                      placeholder="Bullet"
                    />
                  </AdminFormField>
                </>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-0">
                  {jsonMode ? (
                    <div className="divide-y divide-white/10 pt-6">
                      {ADVANCED_JSON_FIELDS.map((field) => (
                        <div key={field.key} className="py-6 first:pt-0">
                          <JsonFieldEditor
                            id={field.key}
                            label={field.label}
                            hint={field.hint}
                            value={values[field.key]}
                            onChange={(next) => setField(field.key, next)}
                            emptyFallback={field.emptyFallback}
                            rows={field.rows}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <GalleryEditor
                        value={values.galleryJson}
                        onChange={(json) => setField('galleryJson', json)}
                      />
                      <TiersEditor
                        value={values.tiersJson}
                        onChange={(json) => setField('tiersJson', json)}
                      />
                    </>
                  )}

                  <div className="space-y-6 border-t border-white/12 pt-6">
                    <AdminFormField label="Event checklist" htmlFor="eventChecklist">
                      <LinesListEditor
                        id="eventChecklist"
                        value={values.eventChecklistText}
                        onChange={(text) => setField('eventChecklistText', text)}
                        placeholder="Checklist item"
                      />
                    </AdminFormField>
                    <AdminFormField label="Extended bullets" htmlFor="extendedBullets">
                      <LinesListEditor
                        id="extendedBullets"
                        value={values.extendedBulletsText}
                        onChange={(text) => setField('extendedBulletsText', text)}
                        placeholder="Bullet"
                      />
                    </AdminFormField>
                  </div>

                  {!jsonMode ? (
                    <>
                      <RelatedWorkEditor
                        value={values.relatedWorkJson}
                        onChange={(json) => setField('relatedWorkJson', json)}
                      />
                      <TertiaryCtaEditor
                        value={values.tertiaryCtaJson}
                        onChange={(json) => setField('tertiaryCtaJson', json)}
                      />
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </ServicePreviewDock>
    </div>
  );
}
