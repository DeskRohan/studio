import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exams } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulated Exams</h1>
        <p className="text-muted-foreground">Test your knowledge in a real exam environment.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{exam.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-2">
                <Timer className="h-4 w-4" />
                <span>{exam.duration} minutes</span>
                <span className="mx-1">·</span>
                <span>{exam.questions.length} questions</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* You can add more details about the exam here */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/exams/${exam.id}`}>
                  Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
