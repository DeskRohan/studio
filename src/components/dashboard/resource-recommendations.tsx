"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, ListChecks, FileQuestion } from "lucide-react";
import { getRecommendedResources } from "@/app/actions";

type Recommendations = {
  recommendedTopics: string[];
  recommendedQuestions: string[];
} | null;

export function ResourceRecommendations() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<Recommendations>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      const result = await getRecommendedResources();
      if (result) {
        setRecommendations(result);
      } else {
        setError("Failed to get recommendations. Please try again.");
      }
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Targeted resources just for you.</CardDescription>
        </div>
        <Button onClick={handleGetRecommendations} disabled={isPending} size="sm">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Generate
        </Button>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        {!recommendations && !isPending && (
            <div className="text-center text-muted-foreground py-8">
                <p>Click "Generate" to get your personalized recommendations.</p>
            </div>
        )}
        {isPending && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {recommendations && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center mb-2"><ListChecks className="mr-2 h-5 w-5 text-primary" />Recommended Topics</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedTopics.map(topic => <Badge key={topic} variant="secondary">{topic}</Badge>)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold flex items-center mb-2"><FileQuestion className="mr-2 h-5 w-5 text-primary" />Practice Questions</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedQuestions.map(q => <Badge key={q} variant="outline">{q}</Badge>)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
