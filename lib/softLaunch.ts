import { ffSoftLaunch, isFeatureUnlocked } from '@/lib/featureFlags';

export const SOFT_LAUNCH_QUERY = 'soon';
export const SOFT_LAUNCH_EVENT = 'propagenda:coming-soon';

export function isSoftLaunchEnabled() {
  return ffSoftLaunch;
}

/** True if pathname may load (respects soft-launch + per-page FF_* unlocks). */
export function isRouteUnlocked(pathname: string): boolean {
  return isFeatureUnlocked(pathname);
}

export function openComingSoonModal(path?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(SOFT_LAUNCH_EVENT, { detail: { path: path ?? null } }),
  );
}
