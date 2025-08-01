'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
