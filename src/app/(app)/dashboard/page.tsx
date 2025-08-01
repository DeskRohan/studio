import { OverviewChart } from "@/components/dashboard/overview-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your progress.</p>
      </div>
      <OverviewChart />
    </div>
  );
}
