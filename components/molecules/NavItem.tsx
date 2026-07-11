'use client';

import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/Link';
import type { NavItem } from '@/types/navigation';
import { cn } from '@/components/ui/cn';

export function NavItemLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <AppLink href={item.href} variant="nav" active={active} className="px-2 py-2">
      {item.label}
    </AppLink>
  );
}

export function ServiceNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <AppLink
      href={item.href}
      variant="nav"
      active={active}
      className={cn('block py-2 text-nav-mobile-landscape md:text-2xl')}
    >
      {item.label}
    </AppLink>
  );
}
