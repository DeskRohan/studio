
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
import { defaultRoadmap, RoadmapPhase } from '@/lib/data';
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
import { Skeleton } from '../ui/skeleton';

const USER_DATA_KEY = 'user-profile-data';

const checkPhaseCompletion = (phase: RoadmapPhase) => {
    const allTopicsDone = phase.topics.every(t => t.completed);
    const allProblemsDone = phase.problemsSolved >= phase.totalProblems;
    return allTopicsDone && allProblemsDone;
}

export function RoadmapAccordion() {
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string>('phase-1');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRoadmapData = useCallback(() => {
    setIsLoading(true);
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      setRoadmap(JSON.parse(savedData).roadmap);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRoadmapData();
    
    // Listen for custom event from custom roadmap generator
    window.addEventListener('roadmapUpdated', loadRoadmapData);

    return () => {
        window.removeEventListener('roadmapUpdated', loadRoadmapData);
    }
  }, [loadRoadmapData]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  const updateConsistencyAndStreak = (isProgress: boolean) => {
    if (!isProgress) return;

    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (!savedData) return;

    const userData = JSON.parse(savedData);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // Update consistency
    if (!userData.consistency.includes(todayStr)) {
      userData.consistency.push(todayStr);
    }

    // Update streak
    const streak = userData.streak;
    if (streak.lastCompletedDate === todayStr) {
      // Already completed today, do nothing
    } else {
      const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      if (streak.lastCompletedDate === yesterdayStr) {
        // Extend streak
        streak.count += 1;
        toast({
            title: "Streak Extended!",
            description: `You're now on a ${streak.count} day streak! Keep it up! 🎉`,
        });
      } else {
        // Start new streak
        streak.count = 1;
        toast({
            title: "New Streak Started!",
            description: "You've completed an item for the first time in a while. 🔥",
        });
      }
      streak.lastCompletedDate = todayStr;
    }
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    // Dispatch event to notify other components (like dashboard)
    window.dispatchEvent(new Event('userDataUpdated'));
  };

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
    
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      const userData = JSON.parse(savedData);
      userData.roadmap = newRoadmap;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
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

    const isCompleted = !!newPhaseState.topics.find(t => t.id === topicId)?.completed;
    updateConsistencyAndStreak(isCompleted);
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

    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      const userData = JSON.parse(savedData);
      userData.roadmap = newRoadmap;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }

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
  }

  const handleRestoreDefault = () => {
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      const userData = JSON.parse(savedData);
      userData.roadmap = defaultRoadmap;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setRoadmap(defaultRoadmap);
      window.dispatchEvent(new Event('userDataUpdated'));
      toast({
        title: "Expert Roadmap Restored",
        description: "The expert's roadmap for placements has been applied.",
      });
    }
  }


  const handleResetProgress = () => {
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
      const userData = JSON.parse(savedData);
      const newRoadmap = userData.roadmap.map((phase: RoadmapPhase) => ({
        ...phase,
        problemsSolved: 0,
        topics: phase.topics.map(topic => ({
          ...topic,
          completed: false,
        })),
      }));
      userData.roadmap = newRoadmap;
      userData.streak = { count: 0, lastCompletedDate: null };
      userData.consistency = [];
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setRoadmap(newRoadmap);
      window.dispatchEvent(new Event('userDataUpdated'));
      toast({
          title: "Progress Reset",
          description: "Your roadmap progress and streak have been reset.",
      });
    }
  }

  const getPhaseStatus = (phase: RoadmapPhase) => {
    const completedTopics = phase.topics.filter(t => t.completed).length;
    
    if (checkPhaseCompletion(phase)) return { text: 'Completed', variant: 'default' as const };
    if (completedTopics === 0 && phase.problemsSolved === 0) return { text: 'Not Started', variant: 'secondary' as const };
    return { text: 'In Progress', variant: 'outline' as const };
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
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
                <span>Your progress is saved automatically to this device.</span>
           </div>
        </div>
    </div>
  );
}
