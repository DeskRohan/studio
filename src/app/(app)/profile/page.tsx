
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, KeyRound, Trash2, LogOut, Mail } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { deleteUserData } from '@/services/userData';
import { useAuthState } from 'react-firebase-hooks/auth';


export default function ProfilePage() {
    const [user, loading] = useAuthState(auth);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            
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
    
    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            await deleteUserData(user.uid);
            await signOut(auth);
            
            toast({
                title: "Account Data Cleared",
                description: "All your data has been removed. You have been logged out.",
            });

            router.push('/');
            
        } catch (error) {
             toast({
                title: "Error",
                description: "Could not delete your account data. Please try again.",
                variant: "destructive"
            });
        }
    }

    if (loading || !user) {
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
                            <Input id="name" value={user.displayName || ''} readOnly disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                         <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground" />
                            <Input id="email" value={user.email || ''} readOnly disabled />
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
                        This action will permanently delete all your account data from our servers, including your roadmap, streak, and progress.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and all associated data from our servers.
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
