'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Clapperboard,
  ExternalLink,
  LayoutDashboard,
  Layers,
} from 'lucide-react';
import { AdminChromeProvider } from '@/components/admin/AdminChromeContext';
import { AdminAppHeader, AdminContent } from '@/components/admin/AdminTopbar';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TooltipProvider>
        <AdminChromeProvider>
          <SidebarProvider className="admin-shell flex h-full min-h-0 w-full overflow-hidden bg-charcoal">
          <Sidebar collapsible="icon" variant="sidebar" className="border-white/12 bg-black">
            <SidebarHeader className="border-b border-white/12 px-3 py-3">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <Logo
                  href="/admin"
                  variant="horizontal"
                  className="group-data-[collapsible=icon]:hidden"
                />
                <Logo
                  href="/admin"
                  variant="mark"
                  className="hidden group-data-[collapsible=icon]:inline-flex"
                />
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-accent/40 text-accent-foreground group-data-[collapsible=icon]:hidden"
                >
                  CMS
                </Badge>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-3">
              <SidebarGroup className="p-0">
                <SidebarGroupLabel className="text-white/65">Content</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {links.map((link) => {
                      const active = link.exact
                        ? pathname === link.href
                        : pathname.startsWith(link.href);
                      const Icon = link.icon;

                      return (
                        <SidebarMenuItem key={link.href}>
                          <SidebarMenuButton
                            isActive={active}
                            tooltip={link.label}
                            render={<Link href={link.href} />}
                            className={cn(
                              'text-white/80 hover:bg-white/8 hover:text-white',
                              active && 'bg-orange/15 text-orange',
                            )}
                          >
                            <Icon />
                            <span>{link.label}</span>
                          </SidebarMenuButton>
                          {link.soon && (
                            <SidebarMenuBadge className="border border-white/12 bg-transparent text-[10px] uppercase tracking-wide text-white/65">
                              soon
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/12 px-2 py-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="View website"
                    render={<Link href="/" target="_blank" rel="noopener noreferrer" />}
                    className="text-white/80 hover:bg-white/8 hover:text-white"
                  >
                    <ExternalLink />
                    <span>View website</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <AdminSignOutButton />
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarSeparator className="my-2 bg-white/12" />
              <p className="truncate px-2 text-xs text-white/65 group-data-[collapsible=icon]:hidden">
                {userEmail}
              </p>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-charcoal">
            <AdminAppHeader />
            <AdminContent>{children}</AdminContent>
          </SidebarInset>
        </SidebarProvider>
      </AdminChromeProvider>
    </TooltipProvider>
    </div>
  );
}
