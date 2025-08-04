
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Save, KeyRound, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

const USER_DATA_KEY = 'user-profile-data';
const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';
const STREAK_STORAGE_KEY = 'user-streak-data';
const CONSISTENCY_STORAGE_KEY = 'user-consistency-data';
const AUTH_KEY = 'authenticated_v2';


export default function ProfilePage() {
    const [name, setName] = useState('');
    const [passcode, setPasscode] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(USER_DATA_KEY);
            if (savedData) {
                const { name: savedName } = JSON.parse(savedData);
                setName(savedName);
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
            toast({
                title: "Error",
                description: "Could not load your profile data.",
                variant: "destructive"
            });
        }
    }, [toast]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({ title: "Invalid Name", description: "Name cannot be empty.", variant: "destructive" });
            return;
        }

        if (passcode && (passcode.length !== 4 || !/^\d{4}$/.test(passcode))) {
            toast({ title: "Invalid Passcode", description: "Passcode must be 4 digits, or left empty to keep the old one.", variant: "destructive" });
            return;
        }

        try {
            const savedData = JSON.parse(localStorage.getItem(USER_DATA_KEY)!);
            const newData = {
                ...savedData,
                name: name.trim(),
                ...(passcode && { passcode: passcode }), // Only update passcode if a new one is entered
            };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(newData));
            toast({
                title: "Profile Updated",
                description: "Your information has been successfully saved.",
            });
            // Optionally clear passcode field after save
            setPasscode('');
            // Manually trigger a storage event to update greeting in dashboard and resources page
            window.dispatchEvent(new Event('storage'));

        } catch (error) {
             toast({
                title: "Error",
                description: "Could not save your profile data.",
                variant: "destructive"
            });
        }
    };
    
    const handleDeleteAccount = () => {
        try {
            localStorage.removeItem(USER_DATA_KEY);
            localStorage.removeItem(ROADMAP_STORAGE_KEY);
            localStorage.removeItem(STREAK_STORAGE_KEY);
            localStorage.removeItem(CONSISTENCY_STORAGE_KEY);
            sessionStorage.removeItem(AUTH_KEY);
            
            toast({
                title: "Account Deleted",
                description: "All your local data has been removed.",
            });
            
            router.push('/');

        } catch (error) {
             toast({
                title: "Error",
                description: "Could not delete your account data.",
                variant: "destructive"
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
                <p className="text-muted-foreground">Manage your local profile information.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>
                            This information is stored only on your current device.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="flex items-center gap-2">
                                <User className="text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passcode">New 4-Digit Passcode</Label>
                             <div className="flex items-center gap-2">
                                <KeyRound className="text-muted-foreground" />
                                <Input
                                    id="passcode"
                                    type="password"
                                    value={passcode}
                                    maxLength={4}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    placeholder="Leave empty to keep current passcode"
                                    className="text-lg tracking-[0.5rem]"
                                />
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        This is a permanent action. Once you delete your account, all your data including profile, roadmap progress, and streak will be lost.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and all associated data from this device.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>Yes, Delete My Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
