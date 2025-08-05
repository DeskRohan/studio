
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Trash2, Loader2 } from 'lucide-react';
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
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';

const AUTH_KEY = 'authenticated_v2';


export default function ProfilePage() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = () => {
            const user = auth.currentUser;
            if (user) {
                setName(user.displayName || '');
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name.trim()) {
            toast({ title: "Invalid Name", description: "Name cannot be empty.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: name.trim() });
            
            // Update Firestore document
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { name: name.trim() });
            
            toast({
                title: "Profile Updated",
                description: "Your name has been successfully saved.",
            });
            window.dispatchEvent(new Event('storage')); // Notify dashboard of name change

        } catch (error) {
             toast({
                title: "Error",
                description: "Could not save your profile data.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const user = auth.currentUser;
        if (!user) {
            toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
            setIsDeleting(false);
            return;
        }
        try {
            // 1. Delete Firestore document
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);

            // 2. Delete user from Firebase Auth
            // This is a sensitive operation and might require re-authentication.
            // For simplicity here, we assume it works directly.
            // In a production app, you'd handle re-authentication.
            await user.delete();
            
            sessionStorage.removeItem(AUTH_KEY);
            
            toast({
                title: "Account Deleted",
                description: "All your data has been removed.",
            });
            
            router.push('/');

        } catch (error: any) {
             console.error("Account Deletion Error:", error);
             toast({
                title: "Error Deleting Account",
                description: "Could not delete your account. You may need to sign in again for this operation. Original error: " + error.message,
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
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
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>
                           Your name is associated with your Google account and stored in Firestore.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <div className="flex items-center gap-2">
                                <User className="text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        This is a permanent action. Once you delete your account, all your data including profile, roadmap progress, and streak will be lost from Firestore. This cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Delete Account
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
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>Yes, Delete My Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
