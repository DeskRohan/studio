
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, BrainCircuit, Target, BookOpenCheck, KeyRound, User, Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SplashScreen } from '@/components/splash-screen';
import { SetupAnimation } from '@/components/setup-animation';
import { defaultRoadmap } from '@/lib/data';
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
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getOrCreateUser, saveUserRoadmap, generateUserId } from '@/services/userData';
import type { RoadmapPhase } from '@/services/userData';

const USER_ID_KEY = 'user-id';
const USER_NAME_KEY = 'user-name';
const USER_PASSCODE_KEY = 'user-passcode';


type SetupStep = 'welcome' | 'create-profile' | 'roadmap-selection' | 'login';

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('welcome');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Profile creation state
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  // Roadmap generation state
  const [timeline, setTimeline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = localStorage.getItem('authenticated');
    const userId = localStorage.getItem(USER_ID_KEY);
    
    if (isAuthenticated === 'true' && userId) {
        router.replace('/dashboard');
        return;
    }

    // Check if there's a user id but they aren't authenticated
    if (userId) {
      setSetupStep('login');
    } else {
      setSetupStep('welcome');
    }
    setIsLoading(false);
  }, [router]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && passcode) {
      const userId = generateUserId(name, passcode);
      const userData = {
        name,
        roadmap: defaultRoadmap,
        streak: { count: 0, lastCompletedDate: null },
        consistency: [],
      };
      await getOrCreateUser(userId, userData);

      localStorage.setItem(USER_ID_KEY, userId);
      localStorage.setItem(USER_NAME_KEY, name);
      localStorage.setItem(USER_PASSCODE_KEY, passcode);

      toast({
        title: "Profile Created!",
        description: `Welcome, ${name}! Let's set up your roadmap.`,
      });
      setSetupStep('roadmap-selection');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || !name) {
      toast({
        title: "Login Failed",
        description: "Please enter your name and passcode.",
        variant: "destructive",
      });
      return;
    }
    
    const userId = generateUserId(name, passcode);
    const existingUser = await getOrCreateUser(userId);

    if (existingUser) {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem(USER_ID_KEY, userId);
        localStorage.setItem(USER_NAME_KEY, name);
        localStorage.setItem(USER_PASSCODE_KEY, passcode);
        setIsUnlocked(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    } else {
        toast({
            title: "Login Failed",
            description: "Incorrect name or passcode. Please try again.",
            variant: "destructive",
        });
    }
  };
  
  const handleSelectExpertRoadmap = async () => {
      const userId = localStorage.getItem(USER_ID_KEY);
      if (userId) {
          await saveUserRoadmap(userId, defaultRoadmap);
          toast({ title: "Let's Get Started!", description: "The expert's roadmap has been applied." });
          localStorage.setItem('authenticated', 'true');
          setIsUnlocked(true); // Trigger setup animation
          setTimeout(() => {
              router.push('/dashboard');
          }, 1500);
      }
  };

  const handleGenerateCustomRoadmap = async () => {
    if (!timeline.trim()) return;
    setIsGenerating(true);
    setError('');

    try {
        const response = await generateCustomRoadmap({ timeline });
        const userId = localStorage.getItem(USER_ID_KEY);
        if (userId && response.roadmap && response.roadmap.length > 0) {
            await saveUserRoadmap(userId, response.roadmap as RoadmapPhase[]);
            toast({ title: 'Roadmap Generated!', description: 'Your personalized plan is ready.' });
            localStorage.setItem('authenticated', 'true');
            setIsUnlocked(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } else {
            throw new Error("AI returned an empty or invalid roadmap.");
        }
    } catch (err) {
        console.error(err);
        setError('Failed to generate roadmap. Please check your API key and try again.');
        setIsGenerating(false);
    }
  };


  if (!isClient || isLoading) {
    return <SplashScreen />;
  }
  
  if (isUnlocked) {
      return <SetupAnimation />;
  }

  const renderWelcome = () => (
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
                  <Button onClick={() => setSetupStep('create-profile')} size="lg">Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );

  const renderCreateProfile = () => (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto card-glow-effect">
        <form onSubmit={handleCreateProfile}>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>Let's get you set up. This is stored securely.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground" />
                <Input
                  placeholder="e.g., Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Create a Passcode</label>
              <div className="flex items-center gap-2">
                <KeyRound className="text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="4-digit passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  maxLength={4}
                  pattern="\d{4}"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
  
  const renderLogin = () => (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto card-glow-effect">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Enter your name and passcode to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="flex items-center gap-2">
                    <User className="text-muted-foreground" />
                    <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Passcode</label>
                <div className="flex items-center gap-2">
                    <KeyRound className="text-muted-foreground" />
                    <Input
                        type="password"
                        placeholder="Your 4-digit passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        required
                        maxLength={4}
                        pattern="\d{4}"
                    />
                </div>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-2">
                New user or different device?{" "}
                <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => { localStorage.removeItem(USER_ID_KEY); setSetupStep('create-profile'); }}>
                    Create a new profile.
                </Button>
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Unlock</Button>
          </CardFooter>
        </form>
      </Card>
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

  const renderContent = () => {
    switch (setupStep) {
        case 'login': return renderLogin();
        case 'create-profile': return renderCreateProfile();
        case 'roadmap-selection': return renderRoadmapSelection();
        case 'welcome':
        default:
            return renderWelcome();
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b">
             <div className="flex items-center gap-2 text-lg font-bold text-primary font-headline">
                <GraduationCap className="h-6 w-6" />
                <span>NextGenSDE</span>
             </div>
             {setupStep !== 'roadmap-selection' && <ThemeToggle />}
        </header>
        {renderContent()}
    </div>
  );
}
