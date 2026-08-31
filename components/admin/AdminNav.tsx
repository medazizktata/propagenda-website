'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Clapperboard, LayoutDashboard, Layers } from 'lucide-react';
import { cn } from '@/components/ui/cn';

const links: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  soon?: boolean;
}> = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/case-studies', label: 'Case studies', icon: Briefcase, soon: true },
  { href: '/admin/video', label: 'Video work', icon: Clapperboard, soon: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200',
              link.soon && !active && 'opacity-60',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1">{link.label}</span>
            {link.soon && (
              <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-neutral-500">
                soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
