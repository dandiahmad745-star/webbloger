
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Settings, BookUser, Wrench, Home, Music, ClipboardList, HelpCircle } from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Biji Kopi', icon: Coffee },
  { href: '/admin/resep-kopi', label: 'Resep Kopi', icon: ClipboardList },
  { href: '/admin/faq', label: 'Tanya Jawab', icon: HelpCircle },
  { href: '/admin/kisah-saya', label: 'Kisah Saya', icon: BookUser },
  { href: '/admin/peralatan', label: 'Peralatan', icon: Wrench },
  { href: '/admin/playlist-saya', label: 'Playlist Saya', icon: Music },
  { href: '/admin/pengaturan', label: 'Pengaturan Umum', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary font-headline group-data-[collapsible=icon]:hidden">
                    Admin
                </h2>
                <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/">
                        <SidebarMenuButton tooltip="Kembali ke Situs">
                            <Home/>
                            <span>Kembali ke Situs</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <main className="flex-1 p-4 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <SidebarTrigger className="md:hidden"/>
                    <div>
                        <h1 className="font-headline text-4xl text-primary">Admin Panel</h1>
                        <p className="font-body text-muted-foreground">Kelola semua konten halaman dari satu tempat.</p>
                    </div>
                </div>
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
