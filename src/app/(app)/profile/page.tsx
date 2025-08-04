
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, Trash2 } from 'lucide-react';
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
import { clearUserData, DEFAULT_USER_ID, getUserData } from '@/services/userData';
import type { UserData } from '@/services/userData';


export default function ProfilePage() {
    const [userName, setUserName] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData(DEFAULT_USER_ID);
            setUserName(data?.name || 'Student');
        };
        fetchUserData();
    }, []);
    
    const handleDeleteAccount = async () => {
        await clearUserData(DEFAULT_USER_ID);
        toast({
            title: "Data Cleared",
            description: "All your local progress has been deleted.",
        });
        // Optionally, force a reload to re-initialize the app state
        window.location.href = "/";
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                    <User className="h-8 w-8"/>
                    My Profile
                </h1>
                <p className="text-muted-foreground">Manage your application data and settings.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <CardHeader>
                    <CardTitle>Welcome, {userName}!</CardTitle>
                    <CardDescription>
                        All your progress is saved automatically to this device.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        This action will permanently delete all your progress data from this device. This cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your roadmap progress, streak, and consistency data.
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
