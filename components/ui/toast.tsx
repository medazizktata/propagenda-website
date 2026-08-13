'use client';

import type { ReactNode } from 'react';
import { Toast } from '@base-ui/react/toast';
import { cn } from '@/components/ui/cn';

/**
 * Toast notifications built on the shadcn (base-nova / Base UI) Toast primitive.
 *
 * `showToast(message)` can be called from anywhere — even outside React — via a
 * standalone manager, so call sites stay a one-liner. `<AppToastProvider>` mounts
 * once (in Providers) to wrap the app and render the viewport. Used as a graceful
 * fallback when an action can't complete on screen (e.g. a book-a-call CTA with
 * no scheduling URL configured) instead of a silent no-op.
 */

/** Standalone manager so `showToast` doesn't need the `useToastManager` hook. */
export const toastManager = Toast.createToastManager();

export function showToast(
  message: string,
  opts?: { title?: string; timeout?: number },
): void {
  if (!message) return;
  toastManager.add({
    title: opts?.title,
    description: message,
    timeout: opts?.timeout ?? 5000,
  });
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border border-white/10 border-l-[3px] border-l-orange bg-charcoal px-4 py-3',
        'shadow-[0_16px_40px_-12px_rgb(0_0_0_/_0.6)]',
        'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
        'data-[starting-style]:translate-y-3 data-[starting-style]:opacity-0',
        'data-[ending-style]:translate-y-3 data-[ending-style]:opacity-0',
      )}
    >
      <div className="min-w-0 flex-1">
        {toast.title ? (
          <Toast.Title className="font-sans text-sm font-semibold leading-snug text-white" />
        ) : null}
        <Toast.Description className="font-sans text-sm leading-relaxed text-white/85" />
      </div>
      <Toast.Close
        aria-label="Dismiss"
        className="-mr-1 shrink-0 rounded-md px-1 text-lg leading-none text-white/45 transition-colors hover-fine:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <span aria-hidden>×</span>
      </Toast.Close>
    </Toast.Root>
  ));
}

/** Mount once (in Providers). Wraps the app so `useToastManager` works everywhere. */
export function AppToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={toastManager}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed inset-x-0 bottom-6 z-[9999] mx-auto flex w-[min(92vw,420px)] flex-col gap-2 px-4 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
