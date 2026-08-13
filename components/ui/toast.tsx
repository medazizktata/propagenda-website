'use client';

/**
 * Minimal, dependency-free toast. Call `showToast(message)` from any client
 * component to surface a transient, self-dismissing notice — used as a graceful
 * fallback when an action can't complete (e.g. a book-a-call CTA with no
 * scheduling URL configured) so nothing silently no-ops on screen.
 *
 * Self-contained: injects its own container + styles once, is announced via
 * aria-live, respects reduced-motion, and needs no provider in the tree.
 */

const CONTAINER_ID = 'app-toast-root';
let stylesInjected = false;

function ensureRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null;

  if (!stylesInjected) {
    const style = document.createElement('style');
    style.dataset.appToast = '';
    style.textContent = `
      #${CONTAINER_ID}{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;width:min(92vw,420px);pointer-events:none}
      .app-toast{pointer-events:auto;cursor:pointer;background:#252525;color:#fff;border:1px solid rgba(255,255,255,.1);border-left:3px solid #f58b27;border-radius:12px;padding:12px 16px;font:500 14px/1.5 var(--font-poppins),system-ui,sans-serif;box-shadow:0 16px 40px -12px rgba(0,0,0,.6);opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .28s ease}
      .app-toast.is-in{opacity:1;transform:translateY(0)}
      @media (prefers-reduced-motion: reduce){.app-toast{transition:none}}
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  let root = document.getElementById(CONTAINER_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = CONTAINER_ID;
    document.body.appendChild(root);
  }
  return root;
}

export function showToast(message: string, opts?: { duration?: number }): void {
  const root = ensureRoot();
  if (!root || !message) return;

  const el = document.createElement('div');
  el.className = 'app-toast';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = message;

  let removed = false;
  const dismiss = () => {
    if (removed) return;
    removed = true;
    el.classList.remove('is-in');
    window.setTimeout(() => el.remove(), 300);
  };

  el.addEventListener('click', dismiss);
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  window.setTimeout(dismiss, opts?.duration ?? 4500);
}
