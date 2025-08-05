
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticating(false);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isAuthenticating) {
    return <SplashScreen />;
  }
  
  return <>{children}</>;
}
