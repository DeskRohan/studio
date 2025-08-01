import { GeneratorForm } from "@/components/study-plan/generator-form";

export default function StudyPlanPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Personalized Study Plan</h1>
        <p className="text-muted-foreground">Let our AI craft the perfect 9-month placement preparation plan for you.</p>
      </div>
      <GeneratorForm />
    </div>
  );
}
