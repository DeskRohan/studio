
"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Target, Flame, Quote, Award } from "lucide-react";
import { motivationalQuotes } from "@/lib/quotes";
import { defaultRoadmap } from "@/lib/data";
import { ConsistencyCalendar } from "@/components/dashboard/consistency-calendar";

const OverviewChart = dynamic(() => import('@/components/dashboard/overview-chart').then(mod => mod.OverviewChart), {
  ssr: false,
  loading: () => <Skeleton className="h-96 col-span-1 lg:col-span-3" />,
});

const ROADMAP_STORAGE_KEY = "dsa-roadmap-data";
const STREAK_STORAGE_KEY = "user-streak-data";
const CONSISTENCY_STORAGE_KEY = "user-consistency-data";


type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
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
  const [userName, setUserName] = useState("Rohan");

  useEffect(() => {
    // Quote of the day
    const quoteIndex = new Date().getDate() % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);

    // Load Roadmap from localStorage
    const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
    const roadmapItems: RoadmapItem[] = savedRoadmap ? JSON.parse(savedRoadmap) : defaultRoadmap.map(item => ({ ...item, completed: false }));
    const topicItems = roadmapItems.filter(item => !item.text.startsWith("#"));
    setCompletedCount(topicItems.filter(item => item.completed).length);
    setTotalCount(topicItems.length);

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
             const newItems: RoadmapItem[] = JSON.parse(updatedRoadmap);
             const newTopicItems = newItems.filter(item => !item.text.startsWith("#"));
             setCompletedCount(newTopicItems.filter(item => item.completed).length);
             setTotalCount(newTopicItems.length);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{userName}'s Dashboard</h1>
          <p className="text-muted-foreground">An overview of your progress.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ConsistencyCalendar consistency={consistency} />
             <Card className="lg:col-span-2 card-glow-effect">
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
       <div className="grid grid-cols-1">
            <OverviewChart completed={completedCount} remaining={remainingCount} />
       </div>
    </div>
  );
}
