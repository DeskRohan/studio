
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap } from 'lucide-react';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { defaultRoadmap } from '@/lib/data';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export default function SignInPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/dashboard');
            } else {
                setIsAuthenticating(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // New user, create a document
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: user.displayName || 'Student',
                    email: user.email,
                    createdAt: serverTimestamp(),
                    roadmap: defaultRoadmap,
                    streak: { count: 0, lastCompletedDate: "" },
                    consistency: [],
                });
                toast({
                    title: "Welcome to NextGenSDE!",
                    description: "Your account and personalized roadmap have been created.",
                });
            } else {
                 toast({
                    title: `Welcome back, ${user.displayName}!`,
                    description: "You've successfully signed in.",
                });
            }
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast({
                title: 'Sign-In Failed',
                description: 'Could not sign in with Google. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    if (isAuthenticating) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
            <GraduationCap className="h-20 w-20 text-primary mb-4" />
            <h1 className="text-4xl font-bold font-headline">Welcome to NextGenSDE</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
                Your personalized AI-powered guide to ace your placement preparation. Track your progress, get smart recommendations, and land your dream job.
            </p>
            <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-8"
                size="lg"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                   <>
                    <GoogleIcon />
                    Sign in with Google
                   </>
                )}
            </Button>
        </div>
    );
}
