
"use client";

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
};

export function OverviewChart({ completed, remaining }: { completed: number; remaining: number }) {
    const chartData = [
        { name: "Completed", value: completed, fill: 'var(--color-completed)' },
        { name: "Remaining", value: remaining, fill: 'var(--color-remaining)' },
    ];
    
    const total = completed + remaining;
    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="col-span-1 lg:col-span-full card-glow-effect">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your total progress across the entire roadmap.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[300px] max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [`${value} topics`, name]}
                />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={120}
              strokeWidth={2}
              paddingAngle={4}
              cy="50%"
            >
                <Cell key={`cell-0`} fill="hsl(var(--chart-1))" />
                <Cell key={`cell-1`} fill="hsl(var(--muted))" />
            </Pie>
             {total > 0 && (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-3xl font-bold"
                >
                    {completedPercent}%
                </text>
             )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
