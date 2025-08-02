
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BrainCircuit, Clipboard, Check } from 'lucide-react';
import { askTutor } from '@/ai/flows/ask-tutor';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import ReactMarkdown from 'react-markdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm';

// Custom component to render code blocks with a copy button
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-4 rounded-md bg-secondary/50 text-secondary-foreground">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="text-sm font-semibold">{match[1]}</span>
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <Button variant="ghost" size="sm" className="text-xs">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </CopyToClipboard>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    </div>
  ) : (
    <code className="bg-secondary/50 text-secondary-foreground px-1 py-0.5 rounded-sm" {...props}>
      {children}
    </code>
  );
};


export function NivaFab() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

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
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-40 flex items-center justify-center flex-col gap-1 md:h-auto md:w-auto md:py-2 md:px-4 md:bottom-6 md:right-6 md:rounded-full font-headline"
        >
          <BrainCircuit className="h-6 w-6 md:mr-2" />
          <span className="hidden md:block font-semibold">Ask Niva</span>
          <span className="block text-[10px] leading-none md:hidden">Niva</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isMobile ? 'bottom' : 'right'} 
        className="sm:max-w-lg flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevents autofocus on the first input
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl font-headline">
            <Sparkles className="h-6 w-6 text-primary"/> 
            Niva: Your AI Doubt Solver
          </SheetTitle>
          <SheetDescription>
            Have a quick question about a DSA concept? Ask Niva.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="py-4">
              {(isLoading || answer || error) && (
                <div className="prose prose-sm dark:prose-invert max-w-full">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Thinking...</span>
                    </div>
                  )}
                  {error && <p className="text-destructive">{error}</p>}
                  {answer && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{ code: CodeBlock }}
                    >
                      {answer}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="mt-auto pt-4">
             <div className="w-full space-y-4">
                <form onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="e.g., What is the time complexity of binary search?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={3}
                        disabled={isLoading}
                        className="text-base"
                    />
                </form>
                <Button onClick={() => handleSubmit()} disabled={isLoading || !question.trim()} className="w-full">
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Get Answer
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
