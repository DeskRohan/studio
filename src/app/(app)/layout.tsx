'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/');
    }
  }, [router]);

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
             <div className="flex min-h-screen w-full flex-col bg-background">
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
                </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
