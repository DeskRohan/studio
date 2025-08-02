
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, GraduationCap, BrainCircuit, Target, BookOpenCheck, UserPlus, Info, LogIn, Wand2, Star, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SplashScreen } from '@/components/splash-screen';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { defaultRoadmap } from '@/lib/data';
import { generateCustomRoadmap } from '@/ai/flows/generate-custom-roadmap';
import type { RoadmapPhase } from '@/lib/data';


const USER_DATA_KEY = 'user-profile-data';
const AUTH_KEY = 'authenticated_v2';
const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';


export default function WelcomePage() {
  const [mode, setMode] = useState<'loading' | 'welcome' | 'login' | 'setup' | 'setup-roadmap'>('loading');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      if (userData) {
        setMode('welcome');
      } else {
        setMode('setup');
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
      setMode('setup'); // Fallback to setup if localStorage is unavailable
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        try {
            const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY)!);
            if (passcode === userData.passcode) {
                sessionStorage.setItem(AUTH_KEY, 'true');
                setIsUnlocked(true);
                setTimeout(() => router.push('/dashboard'), 2500);
            } else {
                toast({
                    title: 'Incorrect Passcode',
                    description: 'The passcode you entered is not correct. Please try again.',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        } catch (e) {
             toast({
                title: 'Login Error',
                description: 'Could not find profile data. Please try setting up a new profile.',
                variant: 'destructive',
            });
            setIsLoading(false);
            setMode('setup');
        }
    }, 500);
  };

  const handleSetupDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length !== 4 || !/^\d{4}$/.test(newPasscode)) {
        toast({ title: "Invalid Passcode", description: "Passcode must be exactly 4 digits.", variant: "destructive" });
        return;
    }
    if (!name.trim()) {
        toast({ title: "Invalid Name", description: "Please enter your name.", variant: "destructive" });
        return;
    }
    setShowPrivacyDialog(true);
  }

  const handleUseExpertRoadmap = () => {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(defaultRoadmap));
    finishSetup();
  }

  const handleGenerateCustomRoadmap = async () => {
    if (!timeline.trim()) {
        toast({ title: 'Timeline Required', description: 'Please enter your timeline to generate a plan.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
     try {
        const response = await generateCustomRoadmap({ goal: 'Placement Preparation', timeline });
        if (response.roadmap && response.roadmap.length > 0) {
            localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(response.roadmap));
            finishSetup();
        } else {
             throw new Error("AI returned an empty or invalid roadmap.");
        }
    } catch (err) {
        console.error(err);
        toast({
            title: 'Generation Failed',
            description: 'Could not generate roadmap. The AI might be busy. Please try again or use the expert roadmap.',
            variant: 'destructive'
        });
    } finally {
        setIsLoading(false);
    }
  }

  const finishSetup = () => {
    const userData = { name: name.trim(), passcode: newPasscode };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsUnlocked(true);
    setTimeout(() => router.push('/dashboard'), 2500);
  }

  const confirmPrivacy = () => {
    setMode('setup-roadmap');
    setShowPrivacyDialog(false);
  }


    if (isUnlocked || mode === 'loading') {
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
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
                     {mode === 'welcome' && (
                        <Card className="w-full max-w-sm h-full card-glow-effect flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle className="text-2xl">Welcome!</CardTitle>
                                <CardDescription>
                                    You already have a local profile. Login or create a new one.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Button onClick={() => setMode('login')} className="w-full">
                                    <LogIn className="mr-2 h-4 w-4"/>
                                    Login to Existing Profile
                                </Button>
                                <Button onClick={() => setMode('setup')} variant="outline" className="w-full">
                                    <UserPlus className="mr-2 h-4 w-4"/>
                                    Create a New Profile
                                </Button>
                            </CardContent>
                        </Card>
                     )}
                    {mode === 'login' && (
                        <Card className="w-full max-w-sm h-full card-glow-effect">
                            <CardHeader>
                                <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                                <CardDescription>
                                    Please enter your passcode to access your dashboard.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleLogin}>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="passcode">4-Digit Passcode</Label>
                                        <Input
                                            id="passcode"
                                            type="password"
                                            maxLength={4}
                                            placeholder="••••"
                                            required
                                            value={passcode}
                                            onChange={(e) => setPasscode(e.target.value)}
                                            className="text-center text-lg tracking-[0.5rem]"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                                    Unlock
                                    </Button>
                                    <Button variant="link" size="sm" onClick={() => setMode('welcome')}>
                                        Go Back
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    )}
                    {mode === 'setup' && (
                        <Card className="w-full max-w-sm h-full card-glow-effect">
                            <CardHeader>
                                <CardTitle className="text-2xl">Let's Get Started</CardTitle>
                                <CardDescription>
                                    Create your local profile to begin your journey.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSetupDetails}>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input id="name" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-passcode">Set a 4-Digit Passcode</Label>
                                        <Input
                                            id="new-passcode"
                                            type="password"
                                            maxLength={4}
                                            placeholder="••••"
                                            required
                                            value={newPasscode}
                                            onChange={(e) => setNewPasscode(e.target.value)}
                                            className="text-center text-lg tracking-[0.5rem]"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button type="submit" className="w-full">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Next: Choose Roadmap
                                    </Button>
                                     <p className="text-xs text-muted-foreground flex items-center gap-1.5 text-center mt-2">
                                        <Info className="h-4 w-4 shrink-0" />
                                        <span>Your info is saved only on this device.</span>
                                     </p>
                                </CardFooter>
                            </form>
                        </Card>
                    )}

                    {mode === 'setup-roadmap' && (
                         <Card className="w-full max-w-sm h-full card-glow-effect flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-2xl">Choose Your Path</CardTitle>
                                <CardDescription>
                                    Select a roadmap to start your preparation journey.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow">
                                <Button onClick={handleUseExpertRoadmap} variant="secondary" className="w-full h-auto text-left flex flex-col items-start p-4 gap-1">
                                    <div className="flex items-center gap-2 font-bold">
                                        <Star className="h-5 w-5 text-primary"/>
                                        <span>Use Expert's 9-Month Roadmap</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-7">A comprehensive, battle-tested plan for placements.</p>
                                </Button>
                                
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-lg border p-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timeline" className="flex items-center gap-2 font-bold">
                                            <Wand2 className="h-5 w-5 text-primary"/>
                                            Generate a Custom Plan with AI
                                        </Label>
                                         <Input
                                            id="timeline"
                                            placeholder="e.g., 3 months, 6 weeks..."
                                            value={timeline}
                                            onChange={(e) => setTimeline(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleGenerateCustomRoadmap} disabled={isLoading || !timeline.trim()} className="w-full">
                                        {isLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                                        {isLoading ? 'Generating Your Plan...' : 'Generate with AI'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                  </div>
                </div>
              </div>
            </section>
        </main>
        <AlertDialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Important: Local Data Storage</AlertDialogTitle>
              <AlertDialogDescription>
                Welcome to NextGenSDE v1.0! Please be aware that all your data, including your name, passcode, and roadmap progress, is stored **locally on this device's browser only**.
                <br/><br/>
                This means your data will not be accessible on other devices or browsers. Clearing your browser data will permanently delete your profile and progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmPrivacy}>I Understand, Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
