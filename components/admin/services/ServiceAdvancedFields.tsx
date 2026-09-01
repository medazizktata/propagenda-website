'use client';

import { Plus, Trash2 } from 'lucide-react';
import { AdminFormField, AdminDimPair } from '@/components/admin/AdminFormField';
import { AdminImageField } from '@/components/admin/AdminImageField';
import {
  AdminRepeater,
  AdminRepeaterItem,
  AdminSection,
} from '@/components/admin/AdminSection';
import { LinesListEditor } from '@/components/admin/services/LinesListEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  emptyBrandingTier,
  emptyGalleryImage,
  emptyRelatedLink,
  parseGalleryField,
  parseRelatedWorkField,
  parseTertiaryCtaField,
  parseTiersField,
  serializeGalleryField,
  serializeRelatedWorkField,
  serializeTertiaryCtaField,
  serializeTiersField,
} from '@/lib/cms/services/json-fields';
import { WORK_SLUGS } from '@/types/content';
import type { BrandingTier, GalleryImage, RelatedLink, ServiceCta } from '@/types/content';

export function GalleryEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const items = parseGalleryField(value);

  function updateItems(next: GalleryImage[]) {
    onChange(serializeGalleryField(next));
  }

  function updateItem(index: number, patch: Partial<GalleryImage>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    updateItems(next);
  }

  function addItem() {
    updateItems([...items, emptyGalleryImage()]);
  }

  function removeItem(index: number) {
    updateItems(items.filter((_, i) => i !== index));
  }

  const displayItems = items.length > 0 ? items : [emptyGalleryImage()];
  const filledCount = displayItems.filter((item) => item.src.trim()).length;

  return (
    <AdminSection
      title={filledCount > 0 ? `Gallery · ${filledCount}` : 'Gallery'}
      description="Images on the service detail page."
    >
      <AdminRepeater>
        {displayItems.map((item, index) => (
          <AdminRepeaterItem
            key={`gallery-${index}`}
            label={item.alt.trim() || item.src.split('/').pop() || `Image ${index + 1}`}
            actions={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white/65 hover:text-white"
                onClick={() => removeItem(index)}
                disabled={displayItems.length === 1 && !item.src && !item.alt}
                aria-label={`Remove image ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            }
          >
            <AdminImageField
              id={`gallery-src-${index}`}
              value={item.src}
              onChange={(src) => updateItem(index, { src })}
              placeholder="/images/services/..."
              layout="leading"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <AdminFormField label="Alt text" htmlFor={`gallery-alt-${index}`}>
                <Input
                  id={`gallery-alt-${index}`}
                  value={item.alt}
                  onChange={(e) => updateItem(index, { alt: e.target.value })}
                  placeholder="Describe the image"
                  className="admin-field h-9"
                />
              </AdminFormField>
              <AdminDimPair
                widthId={`gallery-w-${index}`}
                heightId={`gallery-h-${index}`}
                width={item.width}
                height={item.height}
                onWidthChange={(width) => updateItem(index, { width })}
                onHeightChange={(height) => updateItem(index, { height })}
              />
            </div>
          </AdminRepeaterItem>
        ))}
      </AdminRepeater>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-white/15 bg-transparent text-white hover:bg-white/5"
        onClick={addItem}
      >
        <Plus className="size-4" />
        Add image
      </Button>
    </AdminSection>
  );
}

export function TiersEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const tiers = parseTiersField(value);

  function updateTiers(next: BrandingTier[]) {
    onChange(serializeTiersField(next));
  }

  function updateTier(index: number, patch: Partial<BrandingTier>) {
    updateTiers(tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  }

  function addTier() {
    updateTiers([...tiers, emptyBrandingTier()]);
  }

  function removeTier(index: number) {
    updateTiers(tiers.filter((_, i) => i !== index));
  }

  const displayTiers = tiers.length > 0 ? tiers : [emptyBrandingTier()];

  return (
    <AdminSection title="Pricing tiers" description="Optional tier blocks (e.g. branding packages).">
      <AdminRepeater>
        {displayTiers.map((tier, index) => (
          <AdminRepeaterItem
            key={`tier-${index}`}
            label={tier.name.trim() || `Tier ${index + 1}`}
            actions={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white/65 hover:text-white"
                onClick={() => removeTier(index)}
                disabled={displayTiers.length === 1 && !tier.name && !tier.items.some(Boolean)}
                aria-label={`Remove tier ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            }
          >
            <div className="grid gap-1.5">
              <Label className="text-xs text-white/80">Tier name</Label>
              <Input
                value={tier.name}
                onChange={(e) => updateTier(index, { name: e.target.value })}
                placeholder="Basic branding"
                className="admin-field h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-white/80">Included items</Label>
              <LinesListEditor
                id={`tier-items-${index}`}
                value={tier.items.join('\n')}
                onChange={(text) =>
                  updateTier(index, {
                    items: text.split('\n'),
                  })
                }
                placeholder="What's included"
              />
            </div>
          </AdminRepeaterItem>
        ))}
      </AdminRepeater>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-white/15 bg-transparent text-white hover:bg-white/5"
        onClick={addTier}
      >
        <Plus className="size-4" />
        Add tier
      </Button>
    </AdminSection>
  );
}

const WORK_PATHS = WORK_SLUGS.map((slug) => ({
  slug,
  href: `/work/${slug}`,
  label: slug.replace(/-/g, ' '),
}));

export function RelatedWorkEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const links = parseRelatedWorkField(value);

  function updateLinks(next: RelatedLink[]) {
    onChange(serializeRelatedWorkField(next));
  }

  function updateLink(index: number, patch: Partial<RelatedLink>) {
    updateLinks(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function pickWork(index: number, href: string) {
    const match = WORK_PATHS.find((item) => item.href === href);
    updateLink(index, {
      href,
      label: match
        ? match.label.replace(/\b\w/g, (char) => char.toUpperCase())
        : (links[index]?.label ?? ''),
    });
  }

  function addLink() {
    updateLinks([...links, emptyRelatedLink()]);
  }

  function removeLink(index: number) {
    updateLinks(links.filter((_, i) => i !== index));
  }

  const displayLinks = links.length > 0 ? links : [emptyRelatedLink()];

  return (
    <AdminSection title="Related work" description="Links to case studies on this service page.">
      <AdminRepeater>
        {displayLinks.map((link, index) => (
          <AdminRepeaterItem
            key={`related-${index}`}
            label={link.label.trim() || `Link ${index + 1}`}
            actions={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white/65 hover:text-white"
                onClick={() => removeLink(index)}
                disabled={displayLinks.length === 1 && !link.label && !link.href}
                aria-label={`Remove link ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-xs text-white/80">Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, { label: e.target.value })}
                  placeholder="Sanapex Interiors"
                  className="admin-field h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs text-white/80">Case study</Label>
                <Select
                  value={
                    WORK_PATHS.some((item) => item.href === link.href) ? link.href : '__custom__'
                  }
                  onValueChange={(selected) => {
                    if (!selected || selected === '__custom__') return;
                    pickWork(index, selected);
                  }}
                >
                  <SelectTrigger className="admin-field h-9 w-full">
                    <SelectValue placeholder="Pick or type below" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__custom__">Custom path</SelectItem>
                    {WORK_PATHS.map((item) => (
                      <SelectItem key={item.href} value={item.href}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label className="text-xs text-white/80">Href</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(index, { href: e.target.value })}
                  placeholder="/work/slug"
                  className="admin-field h-9 font-mono text-sm"
                />
              </div>
            </div>
          </AdminRepeaterItem>
        ))}
      </AdminRepeater>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-white/15 bg-transparent text-white hover:bg-white/5"
        onClick={addLink}
      >
        <Plus className="size-4" />
        Add link
      </Button>
    </AdminSection>
  );
}

export function TertiaryCtaEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const parsed = parseTertiaryCtaField(value);
  const enabled = parsed !== null;
  const cta: ServiceCta = parsed ?? { label: '', href: '' };

  function update(next: ServiceCta | null) {
    onChange(serializeTertiaryCtaField(next));
  }

  return (
    <AdminSection
      title="Tertiary CTA"
      description="Optional extra button on the service page."
      defaultOpen={enabled}
    >
      <label className="flex items-center gap-2 text-sm text-white">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            if (e.target.checked) {
              update({ label: cta.label || 'Learn more', href: cta.href || '/contact' });
            } else {
              update(null);
            }
          }}
          className="size-4 rounded border-white/20 accent-orange"
        />
        Show tertiary CTA
      </label>
      {enabled ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label className="text-xs text-white/80">Button label</Label>
            <Input
              value={cta.label}
              onChange={(e) => update({ ...cta, label: e.target.value })}
              placeholder="View portfolio"
              className="admin-field h-9"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-white/80">Link</Label>
            <Input
              value={cta.href}
              onChange={(e) => update({ ...cta, href: e.target.value })}
              placeholder="/work or /contact"
              className="admin-field h-9 font-mono text-sm"
            />
          </div>
        </div>
      ) : null}
    </AdminSection>
  );
}
