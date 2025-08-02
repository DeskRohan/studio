
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, MobileNav } from '@/components/header';
import { Footer } from '@/components/footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { NivaFab } from '@/components/niva-fab';
import { SplashScreen } from '@/components/splash-screen';

const USER_DATA_KEY = 'user-profile-data';
const AUTH_KEY = 'authenticated_v2';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem(AUTH_KEY);
    const hasProfile = localStorage.getItem(USER_DATA_KEY);

    if (!hasProfile) {
        // If no profile exists, send them to the start page to create one
        router.replace('/');
        return;
    }

    if (isAuthenticated !== 'true') {
        // If there's a profile but they aren't authenticated for the session, lock them out.
        router.replace('/');
    } else {
        // User is authenticated
        setIsAuthenticating(false);
    }
  }, [router]);


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
