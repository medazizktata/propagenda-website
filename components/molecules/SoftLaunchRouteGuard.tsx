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
    if (isRouteUnlocked(pathname)) return;
    openComingSoonModal(pathname);
    router.replace(`/?${SOFT_LAUNCH_QUERY}=1`);
  }, [pathname, router]);

  return null;
}
