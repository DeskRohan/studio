"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { questions as allQuestions } from "@/lib/data";
import { CheckCircle, XCircle } from "lucide-react";

type Results = {
  examId: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string; selectedOption: string }[];
};

export function ResultsDisplay({ examId }: { examId: string }) {
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem(`exam_results_${examId}`);
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, [examId]);

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find the results for this exam. Please complete the exam first.</p>
          <Button asChild className="mt-4">
            <Link href="/exams">Back to Exams</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { score, totalQuestions, answers } = results;
  const percentage = Math.round((score / totalQuestions) * 100);
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;

  const chartData = [
    { name: "Correct", value: correctAnswers },
    { name: "Incorrect", value: incorrectAnswers },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>Here's how you performed.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center">
              {percentage}%
            </h2>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{incorrectAnswers}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>
            <Button asChild className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Answer Review</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            {answers.map(answer => {
                const question = allQuestions.find(q => q.id === answer.questionId);
                if (!question) return null;
                const isCorrect = question.answer === answer.selectedOption;
                return (
                    <div key={answer.questionId} className="p-4 border rounded-md">
                        <p className="font-semibold">{question.statement}</p>
                        <div className="mt-2 flex items-center gap-2">
                            {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                            <p>Your answer: <Badge variant={isCorrect ? "default" : "destructive"}>{answer.selectedOption || "Not answered"}</Badge></p>
                        </div>
                        {!isCorrect && (
                            <p className="mt-1 text-sm">Correct answer: <Badge variant="secondary">{question.answer}</Badge></p>
                        )}
                    </div>
                )
            })}
        </CardContent>
      </Card>
    </div>
  );
}
