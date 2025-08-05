
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Trash2, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, deleteUser } from 'firebase/auth';
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


export default function ProfilePage() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) {
            toast({ title: "Invalid Name", description: "Name cannot be empty.", variant: "destructive" });
            return;
        }
        
        setIsLoading(true);
        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: name.trim() });
            
            // Update Firestore document
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { name: name.trim() });

            toast({
                title: "Profile Updated",
                description: "Your name has been successfully saved.",
            });
            window.dispatchEvent(new Event('userDataUpdated')); // Notify other components
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
    
    const handleDeleteData = async () => {
        if (!user) return;

        setIsDeleting(true);
        try {
            // Delete Firestore document first
            const userDocRef = doc(db, 'users', user.uid);
            await deleteDoc(userDocRef);

            // Then delete Firebase Auth user
            await deleteUser(user);
            
            toast({
                title: "Account Deleted",
                description: "Your account and all data have been permanently removed.",
            });
            
            router.push('/');

        } catch (error: any) {
             console.error("Data Deletion Error:", error);
             toast({
                title: "Error Deleting Account",
                description: "Could not delete your account. You may need to sign in again to complete this action. " + error.message,
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
                <p className="text-muted-foreground">Manage your account information.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>
                           Your name is used for greetings across the app.
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
                        This is a permanent action. This will delete your account and all associated data from our servers. This cannot be undone.
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
                                This action cannot be undone. This will permanently delete your account, roadmap progress, profile, and streak from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteData}>Yes, Delete My Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
