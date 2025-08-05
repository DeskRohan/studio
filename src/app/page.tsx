
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SplashScreen } from '@/components/splash-screen';

export default function WelcomePage() {
    const router = useRouter();
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, redirect to dashboard.
                router.push('/dashboard');
            } else {
                // User is not signed in, redirect to signin page.
                const timer = setTimeout(() => {
                    router.push('/signin');
                }, 2500); // Keep splash screen for a bit
                return () => clearTimeout(timer);
            }
        });
        return () => unsubscribe();
    }, [router]);

    return <SplashScreen />;
}
