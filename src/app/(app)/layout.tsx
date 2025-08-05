
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, MobileNav } from '@/components/header';
import { Footer } from '@/components/footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { NivaFab } from '@/components/niva-fab';
import { SplashScreen } from '@/components/splash-screen';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isAuthenticating, setIsAuthenticating] = useState(false); // No longer authenticating, but keeping for structure

  // The authentication logic that was causing the error has been removed.

  if (isAuthenticating) {
    return <SplashScreen />;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
      <NivaFab />
      {isMobile && <MobileNav />}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
