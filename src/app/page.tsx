
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, BrainCircuit, Target, BookOpenCheck, Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SplashScreen } from '@/components/splash-screen';
import { auth, googleProvider } from '@/lib/firebase';
import { defaultRoadmap, RoadmapPhase } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateCustomRoadmap } from '@/ai/flows/generate-custom-roadmap';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const USER_DATA_KEY = 'user-profile-data';
const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';

type SetupStep = 'login' | 'roadmap-selection';

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('login');
  const [timeline, setTimeline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already logged in, redirect to dashboard
        router.replace('/dashboard');
      } else {
        // If no user, stop loading and show the login page
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userProfile = {
        name: user.displayName,
        email: user.email,
        uid: user.uid
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.displayName}!`,
      });
      
      // Check if user is new (no roadmap)
      if (!localStorage.getItem(ROADMAP_STORAGE_KEY)) {
        setSetupStep('roadmap-selection');
        setIsSigningIn(false);
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        title: 'Sign-In Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };
  
  const handleSelectExpertRoadmap = () => {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(defaultRoadmap));
      toast({ title: "Let's Get Started!", description: "The expert's roadmap has been applied." });
      router.push('/dashboard');
  };

  const handleGenerateCustomRoadmap = async () => {
    if (!timeline.trim()) return;
    setIsGenerating(true);
    setError('');

    try {
        const response = await generateCustomRoadmap({ timeline });
        if (response.roadmap && response.roadmap.length > 0) {
            localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(response.roadmap));
            toast({ title: 'Roadmap Generated!', description: 'Your personalized plan is ready.' });
            router.push('/dashboard');
        } else {
            throw new Error("AI returned an empty or invalid roadmap.");
        }
    } catch (err) {
        console.error(err);
        setError('Failed to generate roadmap. Please check your API key and try again.');
        setIsGenerating(false);
    }
  };


  if (isLoading) {
    return <SplashScreen />;
  }
  
  const renderLogin = () => (
     <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
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
                <div className="pt-4">
                  <Button onClick={handleGoogleSignIn} disabled={isSigningIn} size="lg">
                    {isSigningIn ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.5 173.5 58.1l-66.6 64.2C314.6 98 282.7 80 248 80c-82.3 0-149.2 66.9-149.2 149.2s66.9 149.2 149.2 149.2c99.7 0 128.2-74.9 132.5-112.2H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        Sign in with Google
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );

  const renderRoadmapSelection = () => (
     <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto card-glow-effect">
          <CardHeader>
            <CardTitle>Choose Your Path</CardTitle>
            <CardDescription>Select a roadmap to start your journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full" size="lg">Use Expert's 9-Month Roadmap</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Selection</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will apply the expert-curated 9-month roadmap. You can generate a custom one later if you change your mind.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSelectExpertRoadmap}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Generate a Custom Plan</label>
                <Input
                    placeholder="e.g., 3 months, 6 weeks..."
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    disabled={isGenerating}
                />
            </div>
            {error && <p className="text-sm text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> {error}</p>}
            
            <Button
                className="w-full"
                onClick={handleGenerateCustomRoadmap}
                disabled={isGenerating || !timeline.trim()}
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
          </CardContent>
        </Card>
      </main>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b">
             <div className="flex items-center gap-2 text-lg font-bold text-primary font-headline">
                <GraduationCap className="h-6 w-6" />
                <span>NextGenSDE</span>
             </div>
             {setupStep === 'login' && <ThemeToggle />}
        </header>
        {setupStep === 'login' ? renderLogin() : renderRoadmapSelection()}
    </div>
  );
}
