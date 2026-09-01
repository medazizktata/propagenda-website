'use client';

import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ServiceLivePreview } from '@/components/admin/services/ServiceLivePreview';
import { Button } from '@/components/ui/button';
import type { ServiceEditorInput } from '@/lib/cms/services/schema';
import type { ServiceHubCard } from '@/content/servicesHub';
import { cn } from '@/lib/utils';

const DEFAULT_RATIO = 0.38;
const MIN_WIDTH_PX = 360;
const MAX_RATIO = 0.55;
const SLIDE_S = 0.22;

type ServicePreviewDockProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ServiceEditorInput;
  hubCards: ServiceHubCard[];
  children: ReactNode;
};

function clampWidth(width: number, containerWidth: number) {
  const max = Math.max(MIN_WIDTH_PX, Math.round(containerWidth * MAX_RATIO));
  return Math.min(max, Math.max(MIN_WIDTH_PX, Math.round(width)));
}

export function ServicePreviewDock({
  open,
  onOpenChange,
  values,
  hubCards,
  children,
}: ServicePreviewDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widthPx, setWidthPx] = useState(MIN_WIDTH_PX);
  const [dragging, setDragging] = useState(false);
  const openOnceRef = useRef(false);

  useLayoutEffect(() => {
    if (!open || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    setWidthPx((prev) => {
      if (openOnceRef.current && prev > 0) {
        return clampWidth(prev, containerWidth);
      }
      return clampWidth(Math.round(containerWidth * DEFAULT_RATIO), containerWidth);
    });
  }, [open]);

  const onResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const handle = event.currentTarget;
      const container = containerRef.current;
      if (!container) return;

      const startX = event.clientX;
      const startWidth = widthPx;
      setDragging(true);
      handle.setPointerCapture(event.pointerId);

      const onMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX;
        setWidthPx(clampWidth(startWidth + delta, container.clientWidth));
      };
      const onUp = (upEvent: PointerEvent) => {
        setDragging(false);
        handle.releasePointerCapture(upEvent.pointerId);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [widthPx],
  );

  return (
    <div ref={containerRef} className="relative flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>

      <AnimatePresence
        initial={false}
        onExitComplete={() => {
          openOnceRef.current = false;
        }}
      >
        {open ? (
          <m.aside
            key="service-preview-dock"
            initial={openOnceRef.current ? false : { width: 0 }}
            animate={{ width: widthPx }}
            exit={{ width: 0 }}
            transition={dragging ? { duration: 0 } : { duration: SLIDE_S, ease: 'easeOut' }}
            onAnimationComplete={() => {
              if (open) openOnceRef.current = true;
            }}
            className="relative h-full shrink-0 overflow-hidden border-l border-white/12 bg-black"
          >
            <div className="relative flex h-full flex-col overflow-hidden" style={{ width: widthPx }}>
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize preview panel"
                onPointerDown={onResizePointerDown}
                className={cn(
                  'absolute inset-y-0 left-0 z-10 w-1 cursor-col-resize touch-none',
                  'bg-white/10 hover:bg-orange/50',
                  'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2',
                )}
              />

              <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-white/12 px-3">
                <p className="truncate text-xs text-white/65">
                  <span className="text-backstage text-white">Preview</span>
                  <span className="mx-2 text-white/30">·</span>
                  updates as you edit
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-white/80 hover:bg-white/8 hover:text-white"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close preview"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="min-h-0 flex-1">
                <ServiceLivePreview
                  values={values}
                  hubCards={hubCards}
                  hideHeader
                  className="h-full"
                />
              </div>
            </div>
          </m.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
