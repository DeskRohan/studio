import { ResultsDisplay } from "@/components/exams/results-display";

export default function ExamResultsPage({ params }: { params: { id: string } }) {
  return <ResultsDisplay examId={params.id} />;
}
