'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const JOURNAL_DOC_ID = 'user-journal';
type SaveStatus = 'unsaved' | 'saving' | 'saved';

export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const getJournalDocRef = useCallback(() => {
    return doc(db, 'journal', JOURNAL_DOC_ID);
  }, []);

  // Effect for initial loading of the journal
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

  const handleSave = useCallback(async (currentEntry: string) => {
    setSaveStatus('saving');
    const docRef = getJournalDocRef();
    try {
      await setDoc(docRef, { entry: currentEntry }, { merge: true });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: 'Error',
        description: 'Could not save your journal entry.',
        variant: 'destructive',
      });
      setSaveStatus('unsaved');
    }
  }, [getJournalDocRef, toast]);
  
  // Effect for auto-saving with debounce
  useEffect(() => {
    if (isLoading) return; // Don't save while loading initial data
    if (saveStatus === 'saved') return; // Don't trigger save if already saved

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
        handleSave(entry);
    }, 1500); // 1.5-second debounce delay

    return () => {
        if(debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    }

  }, [entry, isLoading, handleSave, saveStatus]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveStatus('unsaved');
    setEntry(e.target.value);
  }

  const getStatusIndicator = () => {
    switch(saveStatus) {
        case 'saving':
            return <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" />Saving...</span>;
        case 'saved':
            return <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="h-4 w-4" />Saved</span>;
        case 'unsaved':
             return <span className="flex items-center gap-2 text-sm text-muted-foreground">Editing...</span>;
        default:
            return null;
    }
  }


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
              onChange={handleTextChange}
              rows={12}
              disabled={isLoading}
            />
          )}
        </CardContent>
        <CardFooter className="justify-between">
           {!isLoading && getStatusIndicator()}
        </CardFooter>
      </Card>
    </div>
  );
}
