
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Save, KeyRound, Trash2, LogOut, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
} from "@/components/ui/alert-dialog"

const USER_DATA_KEY = 'user-profile-data';
const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';
const STREAK_STORAGE_KEY = 'user-streak-data';
const CONSISTENCY_STORAGE_KEY = 'user-consistency-data';

type UserProfile = {
    name: string;
    email: string;
    uid: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(USER_DATA_KEY);
            if (savedData) {
                setUser(JSON.parse(savedData));
            } else {
                // If no data, maybe the user isn't logged in correctly.
                // The layout should handle this, but as a fallback:
                router.replace('/');
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
            toast({
                title: "Error",
                description: "Could not load your profile data.",
                variant: "destructive"
            });
        }
    }, [toast, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Clear all local data on logout
            localStorage.removeItem(USER_DATA_KEY);
            localStorage.removeItem(ROADMAP_STORAGE_KEY);
            localStorage.removeItem(STREAK_STORAGE_KEY);
            localStorage.removeItem(CONSISTENCY_STORAGE_KEY);
            
            toast({
                title: "Logged Out",
                description: "You have been successfully signed out.",
            });
            
            router.push('/');

        } catch (error) {
             toast({
                title: "Logout Failed",
                description: "Could not sign you out. Please try again.",
                variant: "destructive"
            });
        }
    }
    
    const handleDeleteAccount = () => {
        // Note: This only clears local data. It does not delete the Firebase user account.
        // For a full implementation, you would need a backend function to delete the user from Firebase Auth.
        try {
            localStorage.removeItem(USER_DATA_KEY);
            localStorage.removeItem(ROADMAP_STORAGE_KEY);
            localStorage.removeItem(STREAK_STORAGE_KEY);
            localStorage.removeItem(CONSISTENCY_STORAGE_KEY);
            
            toast({
                title: "Account Data Cleared",
                description: "All your local data on this device has been removed. Please log out to complete.",
            });
            
            // We don't log out here automatically to let the user see the message.
            // The logout button is separate.

        } catch (error) {
             toast({
                title: "Error",
                description: "Could not delete your account data.",
                variant: "destructive"
            });
        }
    }

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                    <User className="h-8 w-8"/>
                    My Profile
                </h1>
                <p className="text-muted-foreground">Manage your profile information.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                        This information is from your Google account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground" />
                            <Input id="name" value={user.name} readOnly disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                         <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground" />
                            <Input id="email" value={user.email} readOnly disabled />
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
                        This action will clear all your progress (roadmap, streak, etc.) from this device. It will NOT delete your Google account.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Local Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your roadmap, streak, and consistency data from this device's local storage.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>Yes, Clear My Data</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
