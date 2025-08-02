'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { askTutor } from '@/ai/flows/ask-tutor';

export default function AiTutorPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setError('');

    try {
      const response = await askTutor({ question });
      setAnswer(response.answer);
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gyanu: Your AI Doubt Solver</h1>
        <p className="text-muted-foreground">
          Have a quick question about a DSA concept? Ask Gyanu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter a simple question about data structures or algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., What is the time complexity of binary search?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Answer
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoading || answer || error) && (
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-full">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Thinking...</span>
                </div>
              )}
              {error && <p className="text-destructive">{error}</p>}
              {answer && <p>{answer}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
