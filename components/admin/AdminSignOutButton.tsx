'use client';

import { LogOut } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { signOut } from '@/app/admin/(protected)/actions';

export function AdminSignOutButton() {
  return (
    <form action={signOut} className="w-full">
      <SidebarMenuButton type="submit" tooltip="Sign out" className="w-full">
        <LogOut />
        <span>Sign out</span>
      </SidebarMenuButton>
    </form>
  );
}
