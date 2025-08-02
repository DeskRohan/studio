
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ConsistencyCalendar({ consistency = [] }: { consistency: string[] }) {
  const completedDays = consistency.map(dateStr => new Date(dateStr));

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
          showOutsideDays={false}
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-semibold",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 rounded-md",
            day_today: "bg-accent text-accent-foreground rounded-md",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </CardContent>
    </Card>
  );
}
