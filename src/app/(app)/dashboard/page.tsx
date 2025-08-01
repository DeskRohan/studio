
"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Target, Flame, Quote, Award } from "lucide-react";
import { motivationalQuotes } from "@/lib/quotes";
import { defaultRoadmap } from "@/lib/data";
import { ConsistencyCalendar } from "@/components/dashboard/consistency-calendar";
import { getGreeting } from "@/lib/greetings";

const OverviewChart = dynamic(() => import('@/components/dashboard/overview-chart').then(mod => mod.OverviewChart), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[400px] w-full" />,
});

const ROADMAP_STORAGE_KEY = "dsa-roadmap-data-v2";
const STREAK_STORAGE_KEY = "user-streak-data";
const CONSISTENCY_STORAGE_KEY = "user-consistency-data";
const USER_DATA_KEY = 'user-profile-data';


type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

type RoadmapPhase = {
    id: number;
    title: string;
    duration: string;
    goal: string;
    topics: RoadmapItem[];
    practiceGoal: string;
    totalProblems: number;
    problemsSolved: number;
};

type StreakData = {
    count: number;
    lastCompletedDate: string;
}

const getStreakBadge = (streak: number): { name: string; icon: string; level: number } => {
  if (streak >= 30) return { name: "Samrat (Emperor)", icon: "👑", level: 4 };
  if (streak >= 15) return { name: "Yodha (Warrior)", icon: "⚔️", level: 3 };
  if (streak >= 7) return { name: "Sainik (Soldier)", icon: "🛡️", level: 2 };
  if (streak >= 1) return { name: "Prarambhik (Beginner)", icon: "🌱", level: 1 };
  return { name: "No Streak", icon: "✖️", level: 0 };
};

export default function DashboardPage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [consistency, setConsistency] = useState<string[]>([]);
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Quote of the day
    const quoteIndex = new Date().getDate() % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);

    const userData = localStorage.getItem(USER_DATA_KEY);
    const userName = userData ? JSON.parse(userData).name : 'Student';
    setGreeting(getGreeting(userName));


    // Load Roadmap from localStorage
    const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
    const roadmapItems: RoadmapPhase[] = savedRoadmap ? JSON.parse(savedRoadmap) : defaultRoadmap;
    
    let totalTopics = 0;
    let completedTopics = 0;
    roadmapItems.forEach(phase => {
        totalTopics += phase.topics.length;
        completedTopics += phase.topics.filter(topic => topic.completed).length;
    });

    setCompletedCount(completedTopics);
    setTotalCount(totalTopics);

    // Load Streak from localStorage
    const savedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
    const streakData: StreakData = savedStreak ? JSON.parse(savedStreak) : { count: 0, lastCompletedDate: "" };
    setStreak(streakData.count);

    // Load Consistency from localStorage
    const savedConsistency = localStorage.getItem(CONSISTENCY_STORAGE_KEY);
    const consistencyData: string[] = savedConsistency ? JSON.parse(savedConsistency) : [];
    setConsistency(consistencyData);

    setIsLoading(false);

    // Listen for changes from other tabs
     const handleStorageChange = () => {
        const updatedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
        if (updatedRoadmap) {
             const newItems: RoadmapPhase[] = JSON.parse(updatedRoadmap);
             let newTotalTopics = 0;
             let newCompletedTopics = 0;
            newItems.forEach(phase => {
                newTotalTopics += phase.topics.length;
                newCompletedTopics += phase.topics.filter(topic => topic.completed).length;
            });

            setCompletedCount(newCompletedTopics);
            setTotalCount(newTotalTopics);
        }

        const updatedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
        if (updatedStreak) {
            const newStreakData: StreakData = JSON.parse(updatedStreak);
            setStreak(newStreakData.count);
        }

        const updatedConsistency = localStorage.getItem(CONSISTENCY_STORAGE_KEY);
        if (updatedConsistency) {
            setConsistency(JSON.parse(updatedConsistency));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }

  }, []);

  const remainingCount = totalCount - completedCount;
  const streakBadge = getStreakBadge(streak);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{greeting}</h1>
        <p className="text-muted-foreground">An overview of your progress and motivation.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                    </>
                ) : (
                    <>
                        <Card className="card-glow-effect">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{completedCount}</div>
                            <p className="text-xs text-muted-foreground">out of {totalCount} total topics</p>
                          </CardContent>
                        </Card>
                        <Card className="card-glow-effect">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Topics Remaining</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{remainingCount}</div>
                            <p className="text-xs text-muted-foreground">Keep going!</p>
                          </CardContent>
                        </Card>
                        <Card className="card-glow-effect">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
                            <Flame className="h-4 w-4 text-primary" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{streak}</div>
                            <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
                          </CardContent>
                        </Card>
                         <Card className="card-glow-effect">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Streak Badge</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <span>{streakBadge.icon}</span>
                                <span>{streakBadge.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{streak > 0 ? `Level ${streakBadge.level} Achievement` : "Start a streak to earn a badge!"}</p>
                          </CardContent>
                        </Card>
                    </>
                )}
            </div>
            <OverviewChart completed={completedCount} remaining={remainingCount} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            <ConsistencyCalendar consistency={consistency} />
            <Card className="card-glow-effect">
              <CardHeader>
                <CardTitle>Daily Quote</CardTitle>
                 <CardDescription>A little motivation for your day.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4 pt-6">
                 <Quote className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                 <blockquote className="text-sm italic border-l-4 border-primary pl-4">"{quote}"</blockquote>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
