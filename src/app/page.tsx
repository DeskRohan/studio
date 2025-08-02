
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, GraduationCap, BrainCircuit, Target, BookOpenCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/splash-screen';

const CORRECT_PASSCODE = '218701';

export default function PasscodePage() {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        if (passcode === CORRECT_PASSCODE) {
            sessionStorage.setItem('authenticated', 'true');
            setIsUnlocked(true);
            setTimeout(() => router.push('/dashboard'), 2500); // Match splash screen duration
        } else {
            toast({
                title: 'Incorrect Passcode',
                description: 'The passcode you entered is not correct. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    }, 500);
  };

    if (isUnlocked) {
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
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
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
                            <span>AI-Powered Tutor & Interviewer</span>
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
                  
                  <div className="w-full max-w-sm mx-auto">
                    <Card className="w-full h-full card-glow-effect">
                        <CardHeader>
                        <CardTitle className="text-2xl">Enter Passcode</CardTitle>
                        <CardDescription>
                            Please enter the passcode to access your dashboard.
                        </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                            <Label htmlFor="passcode">Passcode</Label>
                            <Input
                                id="passcode"
                                type="password"
                                placeholder="••••••"
                                required
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                            />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                            Unlock
                            </Button>
                        </CardFooter>
                        </form>
                    </Card>
                  </div>
                </div>
              </div>
            </section>
        </main>
    </div>
  );
}
