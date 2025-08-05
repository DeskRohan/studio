
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, List, Target, Info, RefreshCcw } from 'lucide-react';
import { Label } from '../ui/label';
import { defaultRoadmap } from '@/lib/data';
import type { RoadmapPhase } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
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
} from "@/components/ui/alert-dialog";
import confetti from 'canvas-confetti';

const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';
const STREAK_STORAGE_KEY = 'user-streak-data';
const CONSISTENCY_STORAGE_KEY = 'user-consistency-data';

const checkPhaseCompletion = (phase: RoadmapPhase) => {
    const allTopicsDone = phase.topics.every(t => t.completed);
    const allProblemsDone = phase.problemsSolved === phase.totalProblems;
    return allTopicsDone && allProblemsDone;
}

export function RoadmapAccordion() {
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string>('phase-1');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const saveRoadmapToLocalStorage = (newRoadmap: RoadmapPhase[]) => {
      try {
          localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(newRoadmap));
      } catch (error) {
          console.error("Failed to save roadmap to localStorage:", error);
          toast({ title: "Save Error", description: "Could not save your progress.", variant: "destructive" });
      }
  };

  const loadRoadmap = useCallback(() => {
        setIsLoading(true);
        try {
            const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
            if (savedRoadmap) {
                setRoadmap(JSON.parse(savedRoadmap));
            } else {
                setRoadmap(defaultRoadmap);
                localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(defaultRoadmap));
            }
        } catch (error) {
            console.error('Failed to load roadmap from localStorage:', error);
            setRoadmap(defaultRoadmap);
        }
        setIsLoading(false);
    }, []);

  useEffect(() => {
    loadRoadmap();
    window.addEventListener('roadmapUpdated', loadRoadmap);
    return () => {
        window.removeEventListener('roadmapUpdated', loadRoadmap);
    }
  }, [loadRoadmap]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  const updateConsistencyAndStreak = useCallback((isProgress: boolean) => {
    if (!isProgress) return;

    try {
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        // Consistency
        const savedConsistency = localStorage.getItem(CONSISTENCY_STORAGE_KEY);
        const consistency: string[] = savedConsistency ? JSON.parse(savedConsistency) : [];
        if (!consistency.includes(todayStr)) {
            consistency.push(todayStr);
            localStorage.setItem(CONSISTENCY_STORAGE_KEY, JSON.stringify(consistency));
        }

        // Streak
        const savedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
        const streakData = savedStreak ? JSON.parse(savedStreak) : { count: 0, lastCompletedDate: "" };

        if (streakData.lastCompletedDate === todayStr) return;

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
        
        window.dispatchEvent(new Event('storage')); // To update dashboard

    } catch(e) {
        console.error("Could not update streak/consistency", e);
    }
  }, [toast]);


 const handleToggleTopic = (phaseId: number, topicId: number) => {
    const oldPhaseState = roadmap.find(p => p.id === phaseId);
    if (!oldPhaseState) return;

    const wasPhaseCompletedBefore = checkPhaseCompletion(oldPhaseState);

    const newRoadmap = roadmap.map((phase) => {
      if (phase.id === phaseId) {
        const newTopics = phase.topics.map((topic) =>
          topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
        );
        return { ...phase, topics: newTopics };
      }
      return phase;
    });
    
    setRoadmap(newRoadmap);
    saveRoadmapToLocalStorage(newRoadmap);

    const newPhaseState = newRoadmap.find(p => p.id === phaseId)!;
    const isPhaseCompletedNow = checkPhaseCompletion(newPhaseState);

    if (isPhaseCompletedNow && !wasPhaseCompletedBefore) {
        triggerConfetti();
        toast({
            title: "Phase Complete! 🎉",
            description: `Awesome work on finishing ${newPhaseState.title}. On to the next challenge!`,
        });
    }

    const isCompleted = !!newPhaseState.topics.find(t => t.id === topicId)?.completed;
    updateConsistencyAndStreak(isCompleted);
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleProblemsChange = (phaseId: number, newCount: number) => {
     const oldPhaseState = roadmap.find(p => p.id === phaseId);
     if (!oldPhaseState) return;

     const wasPhaseCompletedBefore = checkPhaseCompletion(oldPhaseState);
     const isProgress = newCount > oldPhaseState.problemsSolved;

     const newRoadmap = roadmap.map((phase) => {
      if (phase.id === phaseId) {
        return { ...phase, problemsSolved: newCount };
      }
      return phase;
    });

    setRoadmap(newRoadmap);
    saveRoadmapToLocalStorage(newRoadmap);

    if (isProgress) {
        updateConsistencyAndStreak(true);
    }
    
    const newPhaseState = newRoadmap.find(p => p.id === phaseId)!;
    const isPhaseCompletedNow = checkPhaseCompletion(newPhaseState);

    if (isPhaseCompletedNow && !wasPhaseCompletedBefore) {
        triggerConfetti();
        toast({
            title: "Phase Complete! 🎉",
            description: `Awesome work on finishing ${newPhaseState.title}. On to the next challenge!`,
        });
    }

    window.dispatchEvent(new Event('storage'));
  }

  const handleRestoreDefault = () => {
    setRoadmap(defaultRoadmap);
    saveRoadmapToLocalStorage(defaultRoadmap);
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Expert Roadmap Restored",
      description: "The expert's roadmap for placements has been applied.",
    });
  }


  const handleResetProgress = () => {
    const newRoadmap = roadmap.map(phase => ({
      ...phase,
      problemsSolved: 0,
      topics: phase.topics.map(topic => ({
        ...topic,
        completed: false,
      })),
    }));
    
    setRoadmap(newRoadmap);
    saveRoadmapToLocalStorage(newRoadmap);
    localStorage.removeItem(STREAK_STORAGE_KEY);
    localStorage.removeItem(CONSISTENCY_STORAGE_KEY);

    window.dispatchEvent(new Event('storage'));
    toast({
        title: "Progress Reset",
        description: "Your roadmap progress and streak have been reset.",
    });
  }

  const getPhaseStatus = (phase: RoadmapPhase) => {
    const completedTopics = phase.topics.filter(t => t.completed).length;
    
    if (checkPhaseCompletion(phase)) return { text: 'Completed', variant: 'default' as const };
    if (completedTopics === 0 && phase.problemsSolved === 0) return { text: 'Not Started', variant: 'secondary' as const };
    return { text: 'In Progress', variant: 'outline' as const };
  }

  if (isLoading) {
      return <div>Loading your roadmap...</div>
  }
  
  if (roadmap.length === 0) {
      return (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-xl font-semibold">Welcome!</h3>
            <p className="text-muted-foreground mt-2">Your roadmap is ready. Start by expanding the first phase.</p>
        </Card>
      )
  }

  return (
    <div>
        <div className="flex justify-end gap-2 mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Expert's Roadmap for Placement
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restore the Expert's Roadmap?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will replace your current roadmap and progress with the expert-curated default roadmap. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRestoreDefault}>Restore</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Reset Progress</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently reset your roadmap progress, streak, and consistency data in this browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleResetProgress}>Yes, Reset It</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
         </div>

        <div className="relative">
            {/* Vertical timeline bar */}
            <div className="absolute left-6 top-6 h-full w-0.5 bg-border -z-10"></div>

            <Accordion
                type="single"
                collapsible
                className="w-full"
                value={activeAccordion}
                onValueChange={setActiveAccordion}
            >
            {roadmap.map((phase) => {
              const completedTopics = phase.topics.filter(t => t.completed).length;
              const totalTopics = phase.topics.length;
              const phaseProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
              const status = getPhaseStatus(phase);

              return (
                <div key={phase.id} className="relative pl-12 pb-8">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl ring-8 ring-background">
                    {phase.id}
                  </div>
                  <AccordionItem value={`phase-${phase.id}`} className="border-none">
                    <Card className="overflow-hidden card-glow-effect">
                        <AccordionTrigger className="p-6 hover:no-underline text-left">
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{phase.title}</h3>
                                        <p className="text-sm font-semibold text-primary">{phase.duration}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{phase.goal}</p>
                                    </div>
                                    <Badge variant={status.variant} className={cn(status.variant === 'default' && "bg-green-600")}>{status.text}</Badge>
                                </div>
                                <div className="mt-4">
                                    <Progress value={phaseProgress} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">{completedTopics} / {totalTopics} topics completed</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4 px-6 pb-6">
                          {/* Topics Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2"><List className="h-5 w-5 text-primary"/> Topics</h4>
                            <div className="space-y-2">
                              {phase.topics.map(topic => (
                                <div key={topic.id} className="flex items-center gap-3">
                                  <Checkbox
                                    id={`topic-${topic.id}`}
                                    checked={topic.completed}
                                    onCheckedChange={() => handleToggleTopic(phase.id, topic.id)}
                                  />
                                  <Label htmlFor={`topic-${topic.id}`} className={cn("text-sm cursor-pointer", topic.completed && "line-through text-muted-foreground")}>
                                    {topic.text}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Practice Goal Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary"/> Practice Goal</h4>
                             <p className="text-sm text-muted-foreground">{phase.practiceGoal}</p>
                             <div className="flex items-center gap-4 pt-2">
                                <Slider
                                    value={[phase.problemsSolved]}
                                    max={phase.totalProblems}
                                    step={1}
                                    onValueChange={(value) => handleProblemsChange(phase.id, value[0])}
                                />
                                <span className="text-sm font-semibold w-24 text-right">{phase.problemsSolved} / {phase.totalProblems}</span>
                             </div>
                          </div>

                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </div>
              );
            })}
          </Accordion>
           <div className="text-xs text-muted-foreground flex items-center gap-2 pl-12">
                <Info className="h-4 w-4" />
                <span>Your progress is saved automatically to your browser's local storage.</span>
           </div>
        </div>
    </div>
  );
}
