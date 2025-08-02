
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, Loader2, Save, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultRoadmap } from "@/lib/data";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { format, subDays } from "date-fns";

type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

type StreakData = {
    count: number;
    lastCompletedDate: string;
}

const ROADMAP_DOC_ID = "dsa-roadmap-main";
const STREAK_DOC_ID = "user-streak";


export function RoadmapTracker() {
  const { toast } = useToast();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const getRoadmapDocRef = useCallback(() => doc(db, "roadmaps", ROADMAP_DOC_ID), []);
  const getStreakDocRef = useCallback(() => doc(db, "streaks", STREAK_DOC_ID), []);

  useEffect(() => {
    const fetchAndSetupListeners = async () => {
      setIsLoading(true);
      const roadmapDocRef = getRoadmapDocRef();
      const streakDocRef = getStreakDocRef();
      
      try {
        const docSnap = await getDoc(roadmapDocRef);

        if (!docSnap.exists()) {
          const newItems = defaultRoadmap.map(item => ({ ...item, completed: false }));
          await setDoc(roadmapDocRef, { items: newItems });
        }

        const streakSnap = await getDoc(streakDocRef);
        if (!streakSnap.exists()) {
            await setDoc(streakDocRef, { count: 0, lastCompletedDate: "" });
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({ title: "Error", description: "Could not initialize your data. Please check your connection and refresh.", variant: "destructive" });
        setIsLoading(false);
        return; 
      }

      const unsubscribeRoadmap = onSnapshot(roadmapDocRef, (doc) => {
        if (doc.exists()) {
          setRoadmapItems(doc.data().items as RoadmapItem[]);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Error with roadmap listener:", error);
        toast({ title: "Error", description: "Could not load your roadmap data in real-time.", variant: "destructive" });
        setIsLoading(false);
      });
      
      return () => {
        unsubscribeRoadmap();
      };
    };

    fetchAndSetupListeners();
  }, [getRoadmapDocRef, getStreakDocRef, toast]);


  const updateStreak = async () => {
    const streakDocRef = getStreakDocRef();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    try {
        const streakSnap = await getDoc(streakDocRef);
        const streakData = (streakSnap.data() as StreakData) || { count: 0, lastCompletedDate: "" };

        if (streakData.lastCompletedDate === todayStr) {
          return; // Already updated today
        }
        
        let newStreakCount = 1;
        let toastMessage = "You've started a new streak! 🔥";
        if (streakData.lastCompletedDate) {
            const lastDate = new Date(streakData.lastCompletedDate);
            if (format(lastDate, 'yyyy-MM-dd') === format(subDays(today, 1), 'yyyy-MM-dd')) {
                newStreakCount = streakData.count + 1;
                toastMessage = `Streak extended to ${newStreakCount} days! Keep it up! 🎉`;
            }
        }
        
        const newStreakData = { count: newStreakCount, lastCompletedDate: todayStr };
        await setDoc(streakDocRef, newStreakData);
        toast({
            title: "Progress!",
            description: toastMessage,
        });
    } catch(e) {
        console.error("Could not update streak", e);
    }
  }

  const handleToggleComplete = (id: number) => {
    const newItems = roadmapItems.map(item => {
        if (item.id === id) {
            return { ...item, completed: !item.completed };
        }
        return item;
    });
    setRoadmapItems(newItems);
  };
  
  const handleSaveProgress = async () => {
    setIsSaving(true);
    const docRef = getRoadmapDocRef();
    
    try {
        await setDoc(docRef, { items: roadmapItems }, { merge: true });

        const hasCompletedTopic = roadmapItems.some(item => !item.text.startsWith('#') && item.completed);

        if(hasCompletedTopic) {
            await updateStreak();
        }

        toast({
            title: "Progress Saved",
            description: "Your roadmap has been successfully saved.",
        });
    } catch (error) {
        console.error("Error saving roadmap:", error);
        toast({
            title: "Error",
            description: "Could not save your progress. Please check your connection.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  }


  const handleResetProgress = async () => {
    const docRef = getRoadmapDocRef();
    const streakDocRef = getStreakDocRef();

    const newItems = defaultRoadmap.map(item => ({...item, completed: false}));

    try {
        await setDoc(docRef, { items: newItems });
        await setDoc(streakDocRef, { count: 0, lastCompletedDate: ""});
        setRoadmapItems(newItems);
        toast({
            title: "Progress Reset",
            description: "Your roadmap progress and streak have been reset.",
        })
    } catch(error) {
        toast({
            title: "Error",
            description: "Could not reset your progress.",
            variant: "destructive",
        });
    }
  }

  const progress = roadmapItems.length > 0
    ? (roadmapItems.filter(i => i.completed && !i.text.startsWith('#')).length / roadmapItems.filter(i => !i.text.startsWith('#')).length) * 100
    : 0;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <Card className="min-h-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex-1">
                <CardTitle>Your Progress Tracker</CardTitle>
                <CardDescription>
                  Check off items, then click "Save Progress" to sync across devices.
                </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button onClick={handleSaveProgress} disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                    {isSaving ? "Saving..." : "Save Progress"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">Reset Progress</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently reset your roadmap progress and streak.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetProgress}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {roadmapItems.length > 0 ? (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium shrink-0">Progress: {Math.round(progress)}%</span>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                </div>
                <div className="space-y-3 pt-4">
                    {roadmapItems.map((item) => (
                      item.text.startsWith('#') ? (
                        <h2 key={item.id} className="text-xl font-semibold tracking-tight mt-6 pb-2 border-b">
                          {item.text.substring(2)}
                        </h2>
                      ) : (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <Checkbox
                                id={`item-${item.id}`}
                                checked={item.completed}
                                onCheckedChange={() => handleToggleComplete(item.id)}
                            />
                            <Label htmlFor={`item-${item.id}`} className={`flex-1 cursor-pointer text-sm md:text-base ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.text}
                            </Label>
                        </div>
                      )
                    ))}
                </div>
          </div>
        ) : (
            <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
                <ListChecks className="h-12 w-12 mb-4" />
                <p>Your roadmap could not be loaded. Please refresh the page.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Click Save to update your progress.</span>
          </div>
      </CardFooter>
    </Card>
  );
}
