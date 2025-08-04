
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import { generateCustomRoadmap } from '@/ai/flows/generate-custom-roadmap';
import type { RoadmapPhase } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ROADMAP_STORAGE_KEY = 'dsa-roadmap-data-v2';

export function CustomRoadmapGenerator() {
    const [timeline, setTimeline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedRoadmap, setGeneratedRoadmap] = useState<RoadmapPhase[] | null>(null);
    const [error, setError] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!timeline.trim()) {
            toast({ title: 'Missing Information', description: 'Please provide a timeline.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedRoadmap(null);

        try {
            const response = await generateCustomRoadmap({ goal: 'Placement Preparation', timeline });
            if (response.roadmap && response.roadmap.length > 0) {
                setGeneratedRoadmap(response.roadmap);
            } else {
                 throw new Error("AI returned an empty or invalid roadmap.");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate roadmap. The AI may be busy, or there might be an issue with your API key. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const applyRoadmap = () => {
        if (!generatedRoadmap) return;
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(generatedRoadmap));
        setGeneratedRoadmap(null);
        toast({
            title: 'Roadmap Updated!',
            description: 'Your new personalized roadmap has been applied.',
        });
        // Dispatch event to notify other components (like the accordion)
        window.dispatchEvent(new Event('roadmapUpdated'));
    };

    return (
        <>
            <Card className="bg-secondary/50 dark:bg-secondary/20 border-primary/20 card-glow-effect mt-8">
                 <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Wand2 className="h-6 w-6 text-primary"/>
                            AI Roadmap Generator
                        </CardTitle>
                        <CardDescription>
                            Don't like the default plan? Generate a new one tailored to your timeline.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="timeline">Your Timeline</Label>
                            <Input
                                id="timeline"
                                placeholder="e.g., 3 months, 6 weeks..."
                                value={timeline}
                                onChange={(e) => setTimeline(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading || !timeline.trim()}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Generating...' : 'Generate My Plan'}
                        </Button>
                    </CardFooter>
                 </form>
            </Card>

            {error && (
                 <div className="mt-4 flex items-center justify-center gap-2 text-destructive font-medium p-4 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {generatedRoadmap && (
                 <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Generated Roadmap Preview</CardTitle>
                        <CardDescription>Review the plan below. If it looks good, apply it to replace your current roadmap.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                         {generatedRoadmap.map(phase => (
                            <div key={phase.id} className="p-3 border rounded-md">
                                <h4 className="font-bold text-primary">{phase.title} ({phase.duration})</h4>
                                <p className="text-sm text-muted-foreground italic">Goal: {phase.goal}</p>
                                <ul className="list-disc pl-5 mt-2 text-sm">
                                    {phase.topics.map(topic => (
                                        <li key={topic.id}>{topic.text}</li>
                                    ))}
                                </ul>
                            </div>
                         ))}
                    </CardContent>
                    <CardFooter className="gap-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>Apply This Roadmap</Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Applying this new roadmap will overwrite your current progress, including all completed topics and problem counts. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={applyRoadmap}>Yes, Apply It</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" onClick={() => setGeneratedRoadmap(null)}>Discard</Button>
                    </CardFooter>
                 </Card>
            )}
        </>
    );
}
