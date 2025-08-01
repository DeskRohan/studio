
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
import { ListChecks, Loader2, CheckCircle2, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultRoadmap } from "@/lib/data";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { format, isToday, isYesterday, subDays } from "date-fns";

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

export function RoadmapTracker() {
  const { toast } = useToast();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streakData, setStreakData] = useState<StreakData>({ count: 0, lastCompletedDate: ""});

  const getRoadmapDocRef = useCallback(() => {
    return doc(db, "roadmaps", ROADMAP_DOC_ID);
  }, []);

  const getStreakDocRef = useCallback(() => {
    return doc(db, "streaks", "user-streak");
  }, []);

  useEffect(() => {
    const roadmapDocRef = getRoadmapDocRef();
    const streakDocRef = getStreakDocRef();

    const initializeData = async () => {
      // First, set up the real-time listener to get live updates
      const unsubscribeRoadmap = onSnapshot(roadmapDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setRoadmapItems(docSnap.data().items as RoadmapItem[]);
        } else {
            // If the document doesn't exist after the initial check, create it.
            // This is safer than checking before listening.
            console.log("Roadmap not found, creating a new one.");
            setDoc(roadmapDocRef, { items: defaultRoadmap });
            setRoadmapItems(defaultRoadmap);
        }
        setIsLoading(false);
      }, (error) => {
          console.error("Error fetching roadmap:", error);
          toast({ title: "Error", description: "Could not load roadmap.", variant: "destructive" });
          setIsLoading(false);
      });
      
      const unsubscribeStreak = onSnapshot(streakDocRef, (docSnap) => {
          if (docSnap.exists()) {
              setStreakData(docSnap.data() as StreakData);
          } else {
              setDoc(streakDocRef, { count: 0, lastCompletedDate: "" });
          }
      });

      return () => {
        unsubscribeRoadmap();
        unsubscribeStreak();
      }
    }

    const unsubPromise = initializeData();

    return () => {
        unsubPromise.then(unsub => unsub && unsub());
    }
  }, [getRoadmapDocRef, getStreakDocRef, toast]);


  const updateStreak = async () => {
    const streakDocRef = getStreakDocRef();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    if (streakData.lastCompletedDate === todayStr) {
      return; // Already updated today
    }
    
    let newStreakCount = 1;
    let toastMessage = "You've started a new streak! 🔥";
    if (streakData.lastCompletedDate) {
        const lastDate = new Date(streakData.lastCompletedDate);
        const yesterday = subDays(today, 1);
        if (format(lastDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
            newStreakCount = streakData.count + 1;
            toastMessage = `Streak extended to ${newStreakCount} days! Keep it up! 🎉`;
        }
    }
    
    const newStreakData = { count: newStreakCount, lastCompletedDate: todayStr };
    setStreakData(newStreakData);
    await setDoc(streakDocRef, newStreakData);
    toast({
        title: "Progress!",
        description: toastMessage,
    });
  }

  const handleToggleComplete = async (id: number) => {
    const docRef = getRoadmapDocRef();
    if (!docRef) return;

    let wasCompleted = false;
    const newItems = roadmapItems.map(item => {
        if (item.id === id) {
            wasCompleted = !item.completed;
            return { ...item, completed: !item.completed };
        }
        return item;
    });

    setRoadmapItems(newItems);
    try {
        await setDoc(docRef, { items: newItems }, { merge: true });
        if (wasCompleted) {
          updateStreak();
        }
    } catch (error) {
        console.error("Error updating roadmap:", error);
        toast({
            title: "Error",
            description: "Could not sync your progress. It will be saved locally.",
            variant: "destructive",
        });
    }
  };

  const handleResetProgress = async () => {
    const docRef = getRoadmapDocRef();
    const streakDocRef = getStreakDocRef();
    if (!docRef || !streakDocRef) return;

    const newItems = defaultRoadmap.map(item => ({...item, completed: false}));
    setRoadmapItems(newItems);

    try {
        await setDoc(docRef, { items: newItems });
        await setDoc(streakDocRef, { count: 0, lastCompletedDate: ""});
        toast({
            title: "Progress Reset",
            description: "Your roadmap progress and streak have been successfully reset.",
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
                  Check off items as you complete them. Your progress is saved automatically.
                </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">Reset Progress</Button>
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
                <p>Your roadmap could not be loaded.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Your progress is saved in real-time.</span>
          </div>
      </CardFooter>
    </Card>
  );
}
