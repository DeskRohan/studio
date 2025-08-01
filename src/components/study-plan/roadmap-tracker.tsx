// src/components/study-plan/roadmap-tracker.tsx
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ListChecks, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

export function RoadmapTracker() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [roadmapText, setRoadmapText] = useState("");
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getRoadmapDocRef = useCallback(() => {
    if (!user) return null;
    return doc(db, "roadmaps", user.uid);
  }, [user]);

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
          setRoadmapText(items.map(item => item.text).join("\n"));
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        toast({
          title: "Error",
          description: "Could not load your roadmap.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [getRoadmapDocRef, toast]);

  const handleSaveRoadmap = async () => {
    const docRef = getRoadmapDocRef();
    if (!docRef) return;

    setIsSaving(true);
    const items = roadmapText
      .split("\n")
      .filter(line => line.trim() !== "")
      .map((line, index) => {
        const existingItem = roadmapItems.find(item => item.text === line);
        return {
          id: existingItem?.id || Date.now() + index,
          text: line,
          completed: existingItem?.completed || false,
        };
      });

    try {
      await setDoc(docRef, { items });
      setRoadmapItems(items);
      toast({
        title: "Success!",
        description: "Your roadmap has been saved.",
      });
    } catch (error) {
      console.error("Error saving roadmap:", error);
      toast({
        title: "Error",
        description: "Could not save your roadmap.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            description: "Could not update your progress.",
            variant: "destructive",
        });
        // Revert UI change on failure
        setRoadmapItems(roadmapItems);
    }
  };

  const progress = roadmapItems.length > 0 
    ? (roadmapItems.filter(i => i.completed).length / roadmapItems.length) * 100 
    : 0;
    
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
            <CardHeader>
              <CardTitle>Edit Your Roadmap</CardTitle>
              <CardDescription>
                Enter each topic or task on a new line. Save to update your tracker.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roadmap">Your Roadmap</Label>
                <Textarea
                  id="roadmap"
                  name="roadmap"
                  placeholder="e.g., Learn Arrays&#10;Practice String problems..."
                  value={roadmapText}
                  onChange={(e) => setRoadmapText(e.target.value)}
                  rows={15}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveRoadmap} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Roadmap
              </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2">
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
                        <span className="text-sm font-medium">Progress: {Math.round(progress)}%</span>
                        <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-3 pt-4">
                        {roadmapItems.map((item) => (
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
                        ))}
                    </div>
              </div>
            ) : (
                <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
                    <ListChecks className="h-12 w-12 mb-4" />
                    <p>Your roadmap tracker will appear here once you save it.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
