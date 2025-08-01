"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { subject: "Arrays", score: 85, target: 90 },
  { subject: "Strings", score: 92, target: 90 },
  { subject: "Linked Lists", score: 78, target: 85 },
  { subject: "Trees", score: 65, target: 80 },
  { subject: "Graphs", score: 55, target: 75 },
  { subject: "DP", score: 40, target: 70 },
  { subject: "System Design", score: 75, target: 85 },
];

export function OverviewChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your scores vs. target scores across key topics.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
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
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
             />
            <Legend />
            <Bar dataKey="target" fill="hsl(var(--secondary))" name="Target" radius={[4, 4, 0, 0]} />
            <Bar dataKey="score" fill="hsl(var(--primary))" name="Your Score" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
