'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const JOURNAL_DOC_ID = 'user-journal';

export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const getJournalDocRef = useCallback(() => {
    return doc(db, 'journal', JOURNAL_DOC_ID);
  }, []);

  useEffect(() => {
    const docRef = getJournalDocRef();
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setEntry(doc.data().entry);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching journal:', error);
        toast({
          title: 'Error',
          description: 'Could not load journal entry.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [getJournalDocRef, toast]);

  const handleSave = async () => {
    setIsSaving(true);
    const docRef = getJournalDocRef();
    try {
      await setDoc(docRef, { entry: entry }, { merge: true });
      toast({
        title: 'Saved!',
        description: 'Your journal entry has been saved.',
      });
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: 'Error',
        description: 'Could not save your journal entry.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Journal</h1>
        <p className="text-muted-foreground">
          Jot down your thoughts, goals, and reflections. Your entry is saved automatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Entry</CardTitle>
          <CardDescription>
            What's on your mind today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <Textarea
              placeholder="Start writing..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              rows={12}
              disabled={isSaving}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Entry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
