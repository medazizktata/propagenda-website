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
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';

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
    <TooltipProvider>
      <SidebarProvider className="bg-surface">
        <Sidebar collapsible="icon" variant="inset" className="bg-surface">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-1 py-0.5 group-data-[collapsible=icon]:justify-center">
              <Logo href="/admin" variant="horizontal" className="group-data-[collapsible=icon]:hidden" />
              <Logo href="/admin" variant="mark" className="hidden group-data-[collapsible=icon]:inline-flex" />
              <Badge
                variant="outline"
                className="border-primary/30 bg-accent text-accent-foreground group-data-[collapsible=icon]:hidden"
              >
                CMS
              </Badge>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Content</SidebarGroupLabel>
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
                        >
                          <Icon />
                          <span>{link.label}</span>
                        </SidebarMenuButton>
                        {link.soon && (
                          <SidebarMenuBadge className="bg-muted text-muted-foreground">
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

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="View website"
                  render={<Link href="/" target="_blank" rel="noopener noreferrer" />}
                >
                  <ExternalLink />
                  <span>View website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AdminSignOutButton />
              </SidebarMenuItem>
            </SidebarMenu>
            <p className="truncate px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              {userEmail}
            </p>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-surface">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="hidden h-4 md:block" />
            <p className="hidden text-sm text-muted-foreground md:block">
              Manage site content
            </p>
          </header>
          <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
