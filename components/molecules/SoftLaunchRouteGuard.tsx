'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isRouteUnlocked, openComingSoonModal, SOFT_LAUNCH_QUERY } from '@/lib/softLaunch';

/**
 * Client safety net: if a locked pathname is somehow mounted, kick to home
 * and open the coming-soon modal.
 */
export function SoftLaunchRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Master flag read STATICALLY so it inlines into the client bundle (unlike the dynamic
    // process.env[name] lookups in featureFlags, which don't). When soft launch is off, the
    // guard never fires — every route open.
    if (process.env.NEXT_PUBLIC_FF_SOFT_LAUNCH === 'false') return;
    if (isRouteUnlocked(pathname)) return;
    openComingSoonModal(pathname);
    router.replace(`/?${SOFT_LAUNCH_QUERY}=1`);
  }, [pathname, router]);

  return null;
}
