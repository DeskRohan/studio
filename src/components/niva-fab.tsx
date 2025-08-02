
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { askTutor } from '@/ai/flows/ask-tutor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function NivaFab() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        // Reset state when closing
        setQuestion('');
        setAnswer('');
        setError('');
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-40 flex items-center justify-center flex-col gap-1 md:h-auto md:w-auto md:py-2 md:px-4 md:bottom-6 md:right-6 md:rounded-full"
        >
          <BrainCircuit className="h-6 w-6 md:mr-2" />
          <span className="hidden md:block font-semibold">Ask Niva</span>
          <span className="block text-[10px] leading-none md:hidden">Niva</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary"/> 
            Niva: Your AI Doubt Solver
          </DialogTitle>
          <DialogDescription>
            Have a quick question about a DSA concept? Ask Niva.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <form onSubmit={handleSubmit}>
                <Textarea
                    placeholder="e.g., What is the time complexity of binary search?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={4}
                    disabled={isLoading}
                    className="text-base"
                />
            </form>

            {(isLoading || answer || error) && (
            <div className="prose prose-sm dark:prose-invert max-w-full mt-4">
                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Thinking...</span>
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {answer && <p>{answer}</p>}
            </div>
            )}
        </div>
        <DialogFooter>
          <Button onClick={() => handleSubmit()} disabled={isLoading || !question.trim()}>
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
