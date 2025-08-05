
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Header, MobileNav } from '@/components/header';
import { Footer } from '@/components/footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { NivaFab } from '@/components/niva-fab';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticating(false);
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
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
