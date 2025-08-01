"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions as allQuestions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Timer, ChevronLeft, ChevronRight } from "lucide-react";

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: string[];
};

type Question = (typeof allQuestions)[0];

type Answer = {
  questionId: string;
  selectedOption: string;
};

export function ExamInterface({ exam }: { exam: Exam }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);

  useEffect(() => {
    const examQuestions = allQuestions.filter((q) => exam.questions.includes(q.id));
    setQuestions(examQuestions);
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0) {
        handleSubmit();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const handleSelectOption = (questionId: string, selectedOption: string) => {
    setAnswers(prev => {
        const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
        if (existingAnswerIndex > -1) {
            const newAnswers = [...prev];
            newAnswers[existingAnswerIndex] = { questionId, selectedOption };
            return newAnswers;
        }
        return [...prev, { questionId, selectedOption }];
    });
  };

  const handleSubmit = () => {
    // In a real app, you'd save this to a backend.
    // Here, we'll use localStorage to pass results to the results page.
    const results = {
        examId: exam.id,
        score: answers.reduce((acc, ans) => {
            const question = questions.find(q => q.id === ans.questionId);
            return question && question.answer === ans.selectedOption ? acc + 1 : acc;
        }, 0),
        totalQuestions: questions.length,
        answers,
    };
    localStorage.setItem(`exam_results_${exam.id}`, JSON.stringify(results));
    router.push(`/exams/${exam.id}/results`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading exam...</div>;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-lg bg-primary/10 text-primary px-4 py-2 rounded-lg">
                        <Timer className="h-6 w-6" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
                <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent className="py-6">
                <p className="font-semibold text-lg mb-4">{currentQuestion.statement}</p>
                {currentQuestion.type === "mcq" && currentQuestion.options && (
                    <RadioGroup 
                        onValueChange={(value) => handleSelectOption(currentQuestion.id, value)}
                        value={answers.find(a => a.questionId === currentQuestion.id)?.selectedOption}
                    >
                        {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                            <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                            <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
                        </div>
                        ))}
                    </RadioGroup>
                )}
                 {currentQuestion.type === "coding" && (
                    <Textarea 
                        placeholder="Write your code here..."
                        rows={10}
                        onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                        value={answers.find(a => a.questionId === currentQuestion.id)?.selectedOption || ''}
                    />
                 )}
            </CardContent>
        </Card>
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
            </Button>
            <div className="flex gap-4">
            {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestionIndex(p => Math.min(questions.length - 1, p + 1))}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="default">Submit Exam</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will end the exam and calculate your score. You cannot go back after submitting.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            </div>
        </div>
    </div>
  );
}

// Dummy Textarea component if not already present
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />;
}
