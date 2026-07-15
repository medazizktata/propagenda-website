import { redirect } from 'next/navigation';
import { isFeatureUnlocked } from '@/lib/featureFlags';
import { SOFT_LAUNCH_QUERY } from '@/lib/softLaunch';

/**
 * Server-side route lock. Call from segment layouts so locked pages never
 * render — even if a client navigation skips the click interceptor.
 */
export function assertRouteAccess(pathname: string): void {
  if (isFeatureUnlocked(pathname)) return;
  redirect(`/?${SOFT_LAUNCH_QUERY}=1`);
}
