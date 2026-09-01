'use client';

import { Braces, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ContentStatus } from '@/types/cms';
import { cn } from '@/lib/utils';

export type ServiceEditorTabId = 'content' | 'seo' | 'hub' | 'advanced';

const tabs: { id: ServiceEditorTabId; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'seo', label: 'SEO' },
  { id: 'hub', label: 'Hub card' },
  { id: 'advanced', label: 'Advanced' },
];

type ServiceEditorToolbarProps = {
  activeTab: ServiceEditorTabId;
  onTabChange: (tab: ServiceEditorTabId) => void;
  mode: 'create' | 'edit';
  status: ContentStatus;
  previewOpen: boolean;
  onPreviewToggle: () => void;
  loading: 'save' | 'publish' | 'draft' | null;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  jsonMode?: boolean;
  onJsonModeToggle?: () => void;
  jsonModeReady?: boolean;
};

export function ServiceEditorToolbar({
  activeTab,
  onTabChange,
  mode,
  status,
  previewOpen,
  onPreviewToggle,
  loading,
  onSave,
  onPublish,
  onUnpublish,
  jsonMode = false,
  onJsonModeToggle,
  jsonModeReady = true,
}: ServiceEditorToolbarProps) {
  const busy = loading !== null;
  const showUnpublish = mode === 'edit' && status === 'published';

  return (
    <div className="shrink-0 border-b border-white/12 px-4 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <nav
          className="-mb-px flex gap-5 overflow-x-auto"
          aria-label="Editor sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
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
          {activeTab === 'advanced' && onJsonModeToggle ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                'text-white/65 hover:bg-white/8 hover:text-white',
                jsonMode && 'bg-white/10 text-white',
              )}
              onClick={onJsonModeToggle}
              disabled={!jsonModeReady}
              aria-pressed={jsonMode}
            >
              <Braces className="size-4" />
              JSON
            </Button>
          ) : null}

          <Badge variant={status === 'published' ? 'default' : 'outline'}>
            {status}
          </Badge>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className={cn(
                    'text-white/80 hover:bg-white/8 hover:text-white',
                    previewOpen && 'bg-white/10 text-white',
                  )}
                  onClick={onPreviewToggle}
                  aria-pressed={previewOpen}
                  aria-label={previewOpen ? 'Hide preview' : 'Show preview'}
                >
                  {previewOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              }
            />
            <TooltipContent side="bottom">
              {previewOpen ? 'Hide preview' : 'Show preview'}
            </TooltipContent>
          </Tooltip>

          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={busy}
          >
            {loading === 'save' ? 'Saving…' : 'Save'}
          </Button>

          {status === 'draft' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/8"
              onClick={onPublish}
              disabled={busy}
            >
              {loading === 'publish' ? 'Publishing…' : 'Publish'}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="text-white/80 hover:bg-white/8 hover:text-white"
                    aria-label="More actions"
                    disabled={busy}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem
                  disabled={busy}
                  onClick={onPublish}
                >
                  {loading === 'publish' ? 'Publishing…' : 'Publish changes'}
                </DropdownMenuItem>
                {showUnpublish ? (
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={busy}
                    onClick={onUnpublish}
                  >
                    {loading === 'draft' ? 'Unpublishing…' : 'Unpublish'}
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
