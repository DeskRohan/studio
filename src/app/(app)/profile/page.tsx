
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
import { clearUserData } from '@/services/userData';


const USER_ID_KEY = 'user-id';
const USER_NAME_KEY = 'user-name';
const USER_PASSCODE_KEY = 'user-passcode';


export default function ProfilePage() {
    const [name, setName] = useState('');
    const [passcode, setPasscode] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setName(localStorage.getItem(USER_NAME_KEY) || '');
        setPasscode(localStorage.getItem(USER_PASSCODE_KEY) || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(USER_NAME_KEY);
        localStorage.removeItem(USER_PASSCODE_KEY);
        toast({
            title: "Logged Out",
            description: "You have been successfully signed out.",
        });
        router.push('/');
    }
    
    const handleDeleteAccount = async () => {
        const userId = localStorage.getItem(USER_ID_KEY);
        if (userId) {
            await clearUserData(userId);
            handleLogout();
            toast({
                title: "Account Data Cleared",
                description: "All your data has been removed from this device and the cloud.",
            });
        }
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
                        This information is used to access your synced data.
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
                        This action will permanently delete all your account data from the cloud, including your roadmap, streak, and progress.
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
                                This action cannot be undone. This will permanently delete your account and all associated data from the cloud.
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
