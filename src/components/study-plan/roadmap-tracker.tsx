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
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultRoadmap } from "@/lib/data";
import { Label } from "../ui/label";

type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

const ROADMAP_DOC_ID = "dsa-roadmap-main";

export function RoadmapTracker() {
  const { toast } = useToast();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRoadmapDocRef = useCallback(() => {
    return doc(db, "roadmaps", ROADMAP_DOC_ID);
  }, []);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const docRef = getRoadmapDocRef();
      if (!docRef) return;

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const items = data.items as RoadmapItem[];
          setRoadmapItems(items);
        } else {
          // If no document exists, initialize with default
          await setDoc(docRef, { items: defaultRoadmap });
          setRoadmapItems(defaultRoadmap);
        }
      } catch (error) {
        console.error("Error fetching or creating roadmap:", error);
        toast({
          title: "Error",
          description: "Could not load your roadmap.",
          variant: "destructive",
        });
        setRoadmapItems(defaultRoadmap); // Fallback to default on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [getRoadmapDocRef, toast]);

  const handleToggleComplete = async (id: number) => {
    const docRef = getRoadmapDocRef();
    if (!docRef) return;

    const newItems = roadmapItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setRoadmapItems(newItems);
    try {
        await setDoc(docRef, { items: newItems }, { merge: true });
    } catch (error) {
        console.error("Error updating roadmap:", error);
        toast({
            title: "Error",
            description: "Could not sync your progress. It will be saved locally.",
            variant: "destructive",
        });
        // UI change is already made, so it persists locally for the session
    }
  };

  const progress = roadmapItems.length > 0
    ? (roadmapItems.filter(i => i.completed).length / roadmapItems.length) * 100
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
        <CardTitle>Your Progress Tracker</CardTitle>
        <CardDescription>
          Check off items as you complete them. Your progress is saved automatically.
        </CardDescription>
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
                            <Label htmlFor={`item-${item.id}`} className={`flex-1 cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
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
