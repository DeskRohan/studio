import { RoadmapTracker } from "@/components/study-plan/roadmap-tracker";

export default function StudyPlanPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My Study Roadmap</h1>
        <p className="text-muted-foreground">Enter your roadmap below and track your progress topic by topic.</p>
      </div>
      <RoadmapTracker />
    </div>
  );
}
