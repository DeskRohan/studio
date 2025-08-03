
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Header, MobileNav } from '@/components/header';
import { Footer } from '@/components/footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { NivaFab } from '@/components/niva-fab';
import { SplashScreen } from '@/components/splash-screen';
import { getOrCreateUserDocument } from '@/services/userData';

const USER_DATA_KEY = 'user-profile-data'; // This can still be used for non-sensitive UI data

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in.
        // Get or create their document in Firestore
        await getOrCreateUserDocument(user.uid, user.displayName, user.email);
        
        // Store basic info locally for quick access in UI
        const userProfile = {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
        };
        sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));
        setIsAuthenticating(false);
      } else {
        // User is signed out.
        sessionStorage.removeItem(USER_DATA_KEY);
        router.replace('/');
      }
    });

    // Cleanup subscription on unmount
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
