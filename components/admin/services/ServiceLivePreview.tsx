'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ServiceDetailContent } from '@/components/templates/ServiceDetailContent';
import {
  editorInputToHubCard,
  editorInputToServiceRecord,
  mergeHubCardsForPreview,
} from '@/lib/cms/services/editor-to-record';
import type { ServiceEditorInput } from '@/lib/cms/services/schema';
import type { ServiceHubCard } from '@/content/servicesHub';
import { cn } from '@/lib/utils';

const PREVIEW_BASE_WIDTH = 1280;

type ServiceLivePreviewProps = {
  values: ServiceEditorInput;
  hubCards: ServiceHubCard[];
  className?: string;
  hideHeader?: boolean;
};

export function ServiceLivePreview({
  values,
  hubCards,
  className,
  hideHeader = false,
}: ServiceLivePreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const deferredValues = useDeferredValue(values);
  const isStale = deferredValues !== values;

  const service = useMemo(() => editorInputToServiceRecord(deferredValues), [deferredValues]);

  const previewHubCards = useMemo(() => {
    const draft = editorInputToHubCard(deferredValues);
    return mergeHubCardsForPreview(hubCards, draft, deferredValues.slug);
  }, [deferredValues, hubCards]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const updateScale = () => {
      const width = node.clientWidth - 16;
      setScale(Math.min(1, Math.max(0.28, width / PREVIEW_BASE_WIDTH)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn('relative flex h-full min-h-0 flex-col bg-black', className)}>
      {!hideHeader && (
        <div className="flex shrink-0 items-center justify-between border-b border-white/12 px-4 py-3">
          <p className="text-backstage text-white">Live preview</p>
          {isStale && <span className="text-xs text-orange">Updating…</span>}
        </div>
      )}

      {!service ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-white/80">
          Add a slug and title to preview the page.
        </div>
      ) : (
        <div
          ref={viewportRef}
          className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-[var(--color-charcoal)] p-2"
          data-lenis-prevent
        >
          {hideHeader && isStale && (
            <span className="absolute top-3 right-3 z-10 rounded-md bg-black/80 px-2 py-1 text-xs text-orange">
              Updating…
            </span>
          )}
          <div className="mx-auto" style={{ width: PREVIEW_BASE_WIDTH * scale }}>
            <div
              style={{
                width: PREVIEW_BASE_WIDTH,
                zoom: scale,
              }}
            >
              <ServiceDetailContent service={service} hubCards={previewHubCards} preview />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
