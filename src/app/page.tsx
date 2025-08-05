
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, BrainCircuit, Target, BookOpenCheck, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SplashScreen } from '@/components/splash-screen';
import { defaultRoadmap } from '@/lib/data';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import Image from 'next/image';

const AUTH_KEY = 'authenticated_v2';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);


export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            router.push('/dashboard');
        } else {
            setIsAuthenticating(false);
        }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await checkAndCreateUserProfile(user);
        sessionStorage.setItem(AUTH_KEY, 'true');
        router.push('/dashboard');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Google Sign-In Error:", error);
        toast({
            title: 'Authentication Failed',
            description: 'Could not sign in with Google. Please try again.',
            variant: 'destructive',
        });
      }
    } finally {
        setIsLoading(false);
    }
  };
  
  const checkAndCreateUserProfile = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        // New user, create their profile
        await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            roadmap: defaultRoadmap, // Start with the default roadmap
            streak: { count: 0, lastCompletedDate: "" },
            consistency: [],
        });
    }
  }

  if (isAuthenticating) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b">
             <div className="flex items-center gap-2 text-lg font-bold text-primary font-headline">
                <GraduationCap className="h-6 w-6" />
                <span>NextGenSDE</span>
            </div>
            <ThemeToggle/>
        </header>
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-headline">
                        Unlock Your Placement Potential
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Your personalized roadmap to success. Track your progress, get AI-powered help, and stay motivated on your journey to your dream job.
                      </p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                            <span>AI-Powered Features</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            <span>Personalized Roadmap</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <BookOpenCheck className="h-5 w-5 text-primary" />
                            <span>Progress Tracking</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Card className="w-full max-w-sm h-full card-glow-effect flex flex-col justify-center">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome!</CardTitle>
                            <CardDescription>
                                Sign in with your Google account to begin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Button onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <GoogleIcon />
                                        <span>Sign in with Google</span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                        <CardContent>
                             <p className="text-xs text-muted-foreground flex items-center gap-1.5 text-center mt-2">
                                <Info className="h-4 w-4 shrink-0" />
                                <span>Your progress is saved securely in the cloud.</span>
                             </p>
                        </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>
        </main>
    </div>
  );
}
