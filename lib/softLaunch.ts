import { ffSoftLaunch, isFeatureUnlocked } from '@/lib/featureFlags';

export const SOFT_LAUNCH_QUERY = 'soon';
export const SOFT_LAUNCH_EVENT = 'propagenda:coming-soon';

export function isSoftLaunchEnabled() {
  // Duplicate static check — client click interceptor must not depend solely on
  // module-level const inlining quirks after HMR.
  if (process.env.NEXT_PUBLIC_FF_SOFT_LAUNCH === 'false') return false;
  if (process.env.NEXT_PUBLIC_SOFT_LAUNCH === 'false') return false;
  return ffSoftLaunch;
}

/** True if pathname may load (respects soft-launch + per-page FF_* unlocks). */
export function isRouteUnlocked(pathname: string): boolean {
  // Always go through featureFlags — work can stay locked even with soft launch off.
  return isFeatureUnlocked(pathname);
}

export function openComingSoonModal(path?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(SOFT_LAUNCH_EVENT, { detail: { path: path ?? null } }),
  );
}
