
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
import { List, Target, Info, RefreshCcw } from 'lucide-react';
import { Label } from '../ui/label';
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
import { getUserData, saveUserData, resetUserProgress, restoreDefaultRoadmap, DEFAULT_USER_ID } from '@/services/userData';
import type { RoadmapPhase, UserData } from '@/services/userData';

const checkPhaseCompletion = (phase: RoadmapPhase) => {
    const allTopicsDone = phase.topics.every(t => t.completed);
    const allProblemsDone = phase.problemsSolved >= phase.totalProblems;
    return allTopicsDone && allProblemsDone;
}

export function RoadmapAccordion() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>('phase-1');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRoadmapData = useCallback(async () => {
    setIsLoading(true);
    const data = await getUserData(DEFAULT_USER_ID);
    setUserData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRoadmapData();
    
    const handleRoadmapUpdated = () => loadRoadmapData();
    window.addEventListener('roadmapUpdated', handleRoadmapUpdated);

    return () => {
        window.removeEventListener('roadmapUpdated', handleRoadmapUpdated);
    }
  }, [loadRoadmapData]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  const updateUserDataAndSave = async (updatedData: UserData) => {
      setUserData(updatedData);
      try {
        await saveUserData(DEFAULT_USER_ID, updatedData);
        // Dispatch event to notify other components (like dashboard) that data has changed
        window.dispatchEvent(new Event('userDataUpdated'));
      } catch (error) {
         console.error("Failed to save user data:", error);
         toast({
            title: "Sync Error",
            description: "Could not save your progress to the cloud. Please check your connection.",
            variant: "destructive"
         });
         // Optionally, revert local state if save fails
         loadRoadmapData();
      }
  };

  const handleToggleTopic = (phaseId: number, topicId: number) => {
    if (!userData) return;

    let wasPhaseCompletedBefore = false;
    
    const newRoadmap = userData.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        wasPhaseCompletedBefore = checkPhaseCompletion(phase);
        const newTopics = phase.topics.map((topic) =>
          topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
        );
        return { ...phase, topics: newTopics };
      }
      return phase;
    });

    const isTopicNowCompleted = newRoadmap
      .find(p => p.id === phaseId)?.topics
      .find(t => t.id === topicId)?.completed;
    
    let updatedData = { ...userData, roadmap: newRoadmap };

    const newPhaseState = newRoadmap.find(p => p.id === phaseId)!;
    const isPhaseCompletedNow = checkPhaseCompletion(newPhaseState);

    if (isPhaseCompletedNow && !wasPhaseCompletedBefore) {
        triggerConfetti();
        toast({
            title: "Phase Complete! 🎉",
            description: `Awesome work on finishing ${newPhaseState.title}. On to the next challenge!`,
        });
    }

    if (isTopicNowCompleted) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      let consistency = updatedData.consistency;
      if (!consistency.includes(todayStr)) {
        consistency = [...consistency, todayStr];
      }

      let streak = { ...updatedData.streak };
      if (streak.lastCompletedDate !== todayStr) {
        const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        if (streak.lastCompletedDate === yesterdayStr) {
          streak.count += 1;
          toast({
              title: "Streak Extended!",
              description: `You're now on a ${streak.count} day streak! Keep it up! 🎉`,
          });
        } else {
          streak.count = 1;
          toast({
              title: "New Streak Started!",
              description: "You've completed an item for the first time in a while. 🔥",
          });
        }
        streak.lastCompletedDate = todayStr;
      }
      updatedData = { ...updatedData, consistency, streak };
    }
    
    updateUserDataAndSave(updatedData);
  };

  const handleProblemsChange = (phaseId: number, newCount: number) => {
     if (!userData) return;
    
     let wasPhaseCompletedBefore = false;
     const oldProblemsSolved = userData.roadmap.find(p => p.id === phaseId)!.problemsSolved;

     const newRoadmap = userData.roadmap.map((phase) => {
      if (phase.id === phaseId) {
        wasPhaseCompletedBefore = checkPhaseCompletion(phase);
        return { ...phase, problemsSolved: newCount };
      }
      return phase;
    });

    let updatedData = { ...userData, roadmap: newRoadmap };
    
    if (newCount > oldProblemsSolved) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        let consistency = updatedData.consistency;
        if (!consistency.includes(todayStr)) {
          consistency = [...consistency, todayStr];
        }

        let streak = { ...updatedData.streak };
        if (streak.lastCompletedDate !== todayStr) {
          const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
          if (streak.lastCompletedDate === yesterdayStr) {
            streak.count += 1;
          } else {
            streak.count = 1;
          }
          streak.lastCompletedDate = todayStr;
        }
        updatedData = { ...updatedData, consistency, streak };
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

    updateUserDataAndSave(updatedData);
  }

  const handleRestoreDefault = async () => {
    const updatedUserData = await restoreDefaultRoadmap(DEFAULT_USER_ID);
    setUserData(updatedUserData);
    window.dispatchEvent(new Event('userDataUpdated'));
    toast({
      title: "Expert Roadmap Restored",
      description: "The expert's roadmap for placements has been applied.",
    });
  }


  const handleResetProgress = async () => {
    const updatedUserData = await resetUserProgress(DEFAULT_USER_ID);
    setUserData(updatedUserData);
    window.dispatchEvent(new Event('userDataUpdated'));
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

  if (isLoading || !userData) {
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
            {userData.roadmap.map((phase) => {
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
                <span>Your progress is saved automatically.</span>
           </div>
        </div>
    </div>
  );
}
