
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, KeyRound, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const USER_DATA_KEY = 'user-profile-data';

export default function ProfilePage() {
    const [name, setName] = useState('');
    const [passcode, setPasscode] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const savedData = localStorage.getItem(USER_DATA_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            setName(data.name);
            setPasscode(data.passcode);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        toast({
            title: "Logged Out",
            description: "You have been successfully signed out.",
        });
        router.push('/');
    }
    
    const handleDeleteAccount = () => {
        localStorage.removeItem(USER_DATA_KEY);
        localStorage.removeItem('authenticated');
        toast({
            title: "Account Data Cleared",
            description: "All your data has been removed from this device.",
        });
        router.push('/');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                    <User className="h-8 w-8"/>
                    My Profile
                </h1>
                <p className="text-muted-foreground">Manage your profile information and account settings.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                        This information is stored only on this device.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="passcode">Passcode</Label>
                        <div className="flex items-center gap-2">
                            <KeyRound className="text-muted-foreground" />
                            <Input id="passcode" type="password" value={passcode} readOnly disabled />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardFooter>
            </Card>

            <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        This action will permanently delete all your account data from this device, including your roadmap, streak, and progress.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Account Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and all associated data from this device's local storage.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>Yes, Delete My Data</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
