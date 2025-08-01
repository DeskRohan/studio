"use client";

import { useState, useEffect } from "react";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Target, Flame, Quote, User } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motivationalQuotes } from "@/lib/quotes";

const ROADMAP_DOC_ID = "dsa-roadmap-main";

type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

type StreakData = {
    count: number;
    lastCompletedDate: string;
}

export default function DashboardPage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const quoteIndex = new Date().getDate() % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);

    const roadmapDocRef = doc(db, "roadmaps", ROADMAP_DOC_ID);
    const streakDocRef = doc(db, "streaks", "user-streak");

    const unsubRoadmap = onSnapshot(roadmapDocRef, (doc) => {
      if (doc.exists()) {
        const items = doc.data().items as RoadmapItem[];
        const topicItems = items.filter(item => !item.text.startsWith("#"));
        setCompletedCount(topicItems.filter(item => item.completed).length);
        setTotalCount(topicItems.length);
      }
    });

    const unsubStreak = onSnapshot(streakDocRef, (doc) => {
        if(doc.exists()) {
            setStreak((doc.data() as StreakData).count);
        }
    });

    return () => {
      unsubRoadmap();
      unsubStreak();
    };
  }, []);

  const remainingCount = totalCount - completedCount;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rohan's Dashboard</h1>
        <p className="text-muted-foreground">An overview of your progress.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">out of {totalCount} total topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Remaining</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingCount}</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Quote</CardTitle>
             <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{quote}</p>
          </CardContent>
        </Card>
      </div>
      <OverviewChart completed={completedCount} remaining={remainingCount} />
    </div>
  );
}
