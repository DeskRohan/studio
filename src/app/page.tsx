'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import { GraduationCap } from 'lucide-react';

const CORRECT_PASSCODE = '218701';

export default function PasscodePage() {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        if (passcode === CORRECT_PASSCODE) {
            sessionStorage.setItem('authenticated', 'true');
            router.push('/dashboard');
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-3 text-2xl font-semibold">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1>Placement Prep Pro</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Passcode</CardTitle>
          <CardDescription>
            Please enter the passcode to access your roadmap.
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
  );
}
