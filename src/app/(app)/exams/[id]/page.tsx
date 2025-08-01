import { exams } from "@/lib/data";
import { ExamInterface } from "@/components/exams/exam-interface";
import { notFound } from "next/navigation";

export default function ExamPage({ params }: { params: { id: string } }) {
  const exam = exams.find((e) => e.id === params.id);

  if (!exam) {
    notFound();
  }

  return <ExamInterface exam={exam} />;
}
