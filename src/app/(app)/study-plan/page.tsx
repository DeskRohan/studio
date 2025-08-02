import { RoadmapAccordion } from "@/components/study-plan/roadmap-accordion";

export default function StudyPlanPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Study Roadmap</h1>
        <p className="text-muted-foreground">Track your progress topic by topic and phase by phase.</p>
      </div>
      <RoadmapAccordion />
    </div>
  );
}
