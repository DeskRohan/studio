
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
import { ListChecks, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

const ROADMAP_STORAGE_KEY = "dsa-roadmap-data";
const STREAK_STORAGE_KEY = "user-streak-data";
const CONSISTENCY_STORAGE_KEY = "user-consistency-data";

export function RoadmapTracker() {
  const { toast } = useToast();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
      if (savedRoadmap) {
        setRoadmapItems(JSON.parse(savedRoadmap));
      } else {
        // Initialize with default if nothing is saved
        const newItems = defaultRoadmap.map(item => ({ ...item, completed: false }));
        setRoadmapItems(newItems);
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(newItems));
      }
    } catch (error) {
      console.error("Failed to load roadmap from localStorage", error);
      // Fallback to default roadmap in case of parsing errors
      const newItems = defaultRoadmap.map(item => ({ ...item, completed: false }));
      setRoadmapItems(newItems);
    }
    setIsLoading(false);
  }, []);

  const updateConsistencyAndStreak = useCallback((isCompleted: boolean) => {
    try {
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        // Update Consistency
        const savedConsistency = localStorage.getItem(CONSISTENCY_STORAGE_KEY);
        const consistency: string[] = savedConsistency ? JSON.parse(savedConsistency) : [];
        if (isCompleted) {
            if (!consistency.includes(todayStr)) {
                consistency.push(todayStr);
                localStorage.setItem(CONSISTENCY_STORAGE_KEY, JSON.stringify(consistency));
            }
        }

        // Update Streak
        const savedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
        const streakData: StreakData = savedStreak ? JSON.parse(savedStreak) : { count: 0, lastCompletedDate: "" };

        if (streakData.lastCompletedDate === todayStr) return; // Already updated today

        let newStreakCount = 1;
        let toastMessage = "You've started a new streak! 🔥";
        
        if (streakData.lastCompletedDate) {
            const lastDate = new Date(streakData.lastCompletedDate);
            if (format(subDays(new Date(), 1), 'yyyy-MM-dd') === format(lastDate, 'yyyy-MM-dd')) {
                newStreakCount = streakData.count + 1;
                toastMessage = `Streak extended to ${newStreakCount} days! Keep it up! 🎉`;
            }
        }
        
        const newStreakData = { count: newStreakCount, lastCompletedDate: todayStr };
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreakData));
        toast({
            title: "Progress!",
            description: toastMessage,
        });
        
        // Manually trigger a storage event to update dashboard
        window.dispatchEvent(new Event('storage'));

    } catch(e) {
        console.error("Could not update streak/consistency", e);
    }
  }, [toast]);


  const handleToggleComplete = (id: number) => {
    const newItems = roadmapItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setRoadmapItems(newItems);
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(newItems));
    
    const wasCompleted = !!newItems.find(item => item.id === id)?.completed;

    if (!newItems.find(item => item.id === id)?.text.startsWith('#') && wasCompleted) {
        updateConsistencyAndStreak(true);
    } else {
        // Manually trigger a storage event to update dashboard in the same tab
        window.dispatchEvent(new Event('storage'));
    }
  };
  
  const handleResetProgress = () => {
    const newItems = defaultRoadmap.map(item => ({...item, completed: false}));
    setRoadmapItems(newItems);
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(newItems));

    const newStreakData = { count: 0, lastCompletedDate: ""};
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreakData));
    localStorage.removeItem(CONSISTENCY_STORAGE_KEY);


    // Manually trigger a storage event to update dashboard in the same tab
    window.dispatchEvent(new Event('storage'));
    
    toast({
        title: "Progress Reset",
        description: "Your roadmap progress and streak have been reset.",
    });
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
                  Your progress is saved automatically to this device.
                </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">Reset Progress</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently reset your roadmap progress, streak, and consistency data on this device.
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
                <p>Your roadmap could not be loaded. Please refresh the page.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Checking an item updates your streak and saves your progress automatically.</span>
          </div>
      </CardFooter>
    </Card>
  );
}
