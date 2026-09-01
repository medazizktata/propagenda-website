'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { useAdminChromeContext } from '@/components/admin/AdminChromeContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

function defaultBreadcrumbs(pathname: string) {
  if (pathname === '/admin') {
    return [{ label: 'Dashboard' }];
  }
  if (pathname === '/admin/services') {
    return [{ label: 'Services' }];
  }
  if (pathname === '/admin/services/new') {
    return [
      { label: 'Services', href: '/admin/services' },
      { label: 'New service' },
    ];
  }
  if (/^\/admin\/services\/[^/]+$/.test(pathname)) {
    return [
      { label: 'Services', href: '/admin/services' },
      { label: 'Edit service' },
    ];
  }
  if (pathname.startsWith('/admin/case-studies')) {
    return [{ label: 'Case studies' }];
  }
  if (pathname.startsWith('/admin/video')) {
    return [{ label: 'Video work' }];
  }
  return [{ label: 'CMS' }];
}

export function AdminAppHeader() {
  const pathname = usePathname();
  const { chrome } = useAdminChromeContext();
  const breadcrumbs = chrome?.breadcrumbs ?? defaultBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/12 bg-black px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <SidebarTrigger className="shrink-0 text-white hover:bg-white/8 [&_svg]:size-5" />
        <Separator orientation="vertical" className="hidden h-4 bg-white/12 sm:block" />
        <Breadcrumb className="hidden min-w-0 sm:block">
          <BreadcrumbList className="text-white/65">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={`${crumb.href ?? 'current'}-${crumb.label}`}>
                {index > 0 && <BreadcrumbSeparator className="text-white/40" />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink
                      render={<Link href={crumb.href} />}
                      className="text-white/80 hover:text-white"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="truncate font-medium text-white">
                      {crumb.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 md:gap-2">
        {chrome?.badge ? <div className="shrink-0">{chrome.badge}</div> : null}
        {chrome?.actions}
      </div>
    </header>
  );
}

export function AdminContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { chrome } = useAdminChromeContext();

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col bg-charcoal',
        chrome?.fullBleed ? 'overflow-hidden p-0' : 'overflow-y-auto px-4 py-6 sm:px-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
