"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ROADMAP_DOC_ID = "dsa-roadmap-main";

type RoadmapItem = {
  id: number;
  text: string;
  completed: boolean;
};

type ChartData = {
  subject: string;
  score: number;
  target: number;
};

const chartConfig = {
  score: {
    label: "Your Score",
    color: "hsl(var(--primary))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--secondary))",
  },
};

export function OverviewChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      const docRef = doc(db, "roadmaps", ROADMAP_DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const items = docSnap.data().items as RoadmapItem[];
        const phaseData: { [key: string]: { completed: number; total: number } } = {};
        let currentPhase = "";

        items.forEach(item => {
          if (item.text.startsWith("# Phase")) {
            const phaseName = item.text.split(":")[1].split("(")[0].trim();
            currentPhase = phaseName;
            if (!phaseData[currentPhase]) {
              phaseData[currentPhase] = { completed: 0, total: 0 };
            }
          } else if (currentPhase) {
            phaseData[currentPhase].total++;
            if (item.completed) {
              phaseData[currentPhase].completed++;
            }
          }
        });

        const formattedChartData = Object.keys(phaseData).map(phase => ({
          subject: phase,
          score: (phaseData[phase].completed / phaseData[phase].total) * 100,
          target: 100,
        }));
        setChartData(formattedChartData);
      }
    };

    fetchRoadmapData();
    
    // Set up a listener for real-time updates if needed, e.g., using onSnapshot
    // For this case, fetching once on mount is sufficient as progress is on another page.

  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your completion progress across roadmap phases.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="subject"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent indicator="dot" />}
               />
              <Legend />
              <Bar dataKey="target" fill="var(--color-target)" name="Target" radius={[4, 4, 0, 0]} />
              <Bar dataKey="score" fill="var(--color-score)" name="Your Score" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
