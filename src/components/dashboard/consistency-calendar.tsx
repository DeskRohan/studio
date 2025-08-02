
"use client";

import * as React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ConsistencyCalendar({ consistency = [] }: { consistency: string[] }) {
  const completedDays = consistency.map(dateStr => new Date(dateStr));

  const footer = (
    <div className="text-xs text-muted-foreground p-2 text-center">
      Days you completed at least one topic are highlighted.
    </div>
  );

  return (
    <Card className="col-span-1 card-glow-effect">
      <CardHeader>
        <CardTitle>Consistency Tracker</CardTitle>
        <CardDescription>Your activity for the current month.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-0">
        <DayPicker
          mode="multiple"
          selected={completedDays}
          showOutsideDays
          className="p-3"
          footer={footer}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
            day_today: "bg-accent text-accent-foreground",
          }}
        />
      </CardContent>
    </Card>
  );
}
