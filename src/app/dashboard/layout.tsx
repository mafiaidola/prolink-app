'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LogOut, Settings, BarChart3, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { Icons } from '@/components/icons';
import { useEffect, useState } from 'react';
import type { HomepageContent } from '@/lib/types';
import { getHomepageContent } from '@/lib/data-client';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [content, setContent] = useState<HomepageContent | null>(null);

  useEffect(() => {
    getHomepageContent().then(setContent);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/profiles', label: 'Profiles', icon: User },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/messages', label: 'Messages', icon: Mail },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/">
                {content ? (
                  content.logoUrl ? (
                    <Image src={content.logoUrl} alt={content.title} width={20} height={20} className="object-contain" />
                  ) : (
                    <Icons.Logo className="size-5 fill-current" />
                  )
                ) : (
                  <Skeleton className="size-5 rounded-full" />
                )}
              </Link>
            </Button>
            <div className="flex-1 overflow-hidden">
              {content ? (
                <p className="font-semibold text-lg truncate font-headline">{content.title}</p>
              ) : (
                <Skeleton className="h-5 w-24" />
              )}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <form action={logout}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton type="submit" tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b bg-background px-4 md:justify-end">
          <SidebarTrigger className="md:hidden" />
          <p className="text-sm font-medium">Welcome, Admin!</p>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
