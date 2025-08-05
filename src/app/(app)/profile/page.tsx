
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Trash2, Loader2 } from 'lucide-react';
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

const NAME_STORAGE_KEY = 'user-name';


export default function ProfilePage() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const storedName = localStorage.getItem(NAME_STORAGE_KEY) || '';
        setName(storedName);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name.trim()) {
            toast({ title: "Invalid Name", description: "Name cannot be empty.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        
        try {
            localStorage.setItem(NAME_STORAGE_KEY, name.trim());
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
    
    const handleDeleteData = () => {
        setIsDeleting(true);
        try {
            // Clear all known keys from localStorage
            localStorage.removeItem('dsa-roadmap-data-v2');
            localStorage.removeItem('user-streak-data');
            localStorage.removeItem('user-consistency-data');
            localStorage.removeItem('user-name');
            localStorage.removeItem('splashScreenShown');
            
            toast({
                title: "Local Data Cleared",
                description: "All your progress and profile data has been removed from this browser.",
            });
            
            // Trigger a reload to reset the app state
            window.location.href = '/';

        } catch (error: any) {
             console.error("Data Deletion Error:", error);
             toast({
                title: "Error Deleting Data",
                description: "Could not clear your local data. Error: " + error.message,
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
                <p className="text-muted-foreground">Manage your profile information stored on this device.</p>
            </div>
            <Card className="max-w-2xl mx-auto card-glow-effect">
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>
                           Your name is used for greetings on the dashboard.
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
                        This is a permanent action. This will clear all your application data from this browser, including roadmap progress and streak. This cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Clear All Local Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently clear your roadmap progress, profile, and streak from this browser's storage.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteData}>Yes, Clear My Data</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
