
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Mic, RefreshCw } from 'lucide-react';
import { getInterviewFeedback } from '@/ai/flows/get-interview-feedback';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const interviewQuestions = [
    "Tell me about a time you had to learn a new technology quickly. How did you approach it?",
    "Describe a challenging project you worked on. What was your role, and how did you overcome the obstacles?",
    "How do you handle disagreements with team members or managers?",
    "Walk me through your process for debugging a complex issue.",
    "Where do you see yourself in 5 years, and how does this role fit into your plan?",
    "Explain a complex technical concept (like promises or closures) to a non-technical person.",
    "Tell me about a time you failed. What did you learn from it?"
];

export default function AiInterviewerPage() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getNewQuestion = () => {
    setFeedback('');
    setUserAnswer('');
    setError('');
    const randomIndex = Math.floor(Math.random() * interviewQuestions.length);
    setCurrentQuestion(interviewQuestions[randomIndex]);
  };

  useEffect(() => {
    getNewQuestion();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    setFeedback('');
    setError('');

    try {
      const response = await getInterviewFeedback({ question: currentQuestion, answer: userAnswer });
      setFeedback(response.feedback);
    } catch (err) {
      setError('Sorry, something went wrong while getting feedback. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Interviewer</h1>
        <p className="text-muted-foreground">
          Practice your interviewing skills. Get a question and receive AI-powered feedback on your answer.
        </p>
      </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Interview Question</CardTitle>
                        <CardDescription>
                            Read the question below and formulate your response.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={getNewQuestion} title="Get a new question">
                        <RefreshCw />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold">{currentQuestion}</p>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !userAnswer.trim()}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Feedback
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoading || feedback || error) && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-full">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Analyzing your answer...</span>
                </div>
              )}
              {error && <p className="text-destructive">{error}</p>}
              {feedback && <div dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
