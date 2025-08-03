
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';
import { getLearningRecommendations } from '@/ai/flows/get-learning-recommendations';
import type { RoadmapPhase } from '@/services/userData';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getUserData } from '@/services/userData';

type Recommendation = {
    topic: string;
    recommendation: string;
};

export function Recommendations() {
    const [user, authLoading] = useAuthState(auth);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const findWeakestTopics = (roadmap: RoadmapPhase[] | undefined) => {
        if (!roadmap) return [];
        try {
            const topicProgress: { [key: string]: { completed: number, total: number } } = {};

            const topicKeywords = [
                'Arrays', 'Hashing', 'Binary Search', 'Recursion', 'Linked Lists', 'Stack', 'Queue',
                'Sliding Window', 'Trees', 'BST', 'Graphs', 'Heap', 'Trie', 'DP', 'Dynamic Programming'
            ];

            // Initialize progress for all topics
            topicKeywords.forEach(keyword => {
                topicProgress[keyword] = { completed: 0, total: 0 };
            });
            
            // Aggregate progress
            roadmap.forEach(phase => {
                phase.topics.forEach(topic => {
                    const matchedKeyword = topicKeywords.find(keyword => topic.text.toLowerCase().includes(keyword.toLowerCase()));
                    if (matchedKeyword) {
                        topicProgress[matchedKeyword].total++;
                        if (topic.completed) {
                            topicProgress[matchedKeyword].completed++;
                        }
                    }
                });
            });

            // Calculate completion percentage and find weakest
            const percentages = Object.entries(topicProgress)
                .filter(([, data]) => data.total > 0)
                .map(([topic, data]) => ({
                    topic,
                    percentage: (data.completed / data.total) * 100,
                }));
            
            percentages.sort((a, b) => a.percentage - b.percentage);
            
            return percentages.slice(0, 3).map(p => p.topic);

        } catch (e) {
            console.error("Failed to analyze roadmap progress:", e);
            return [];
        }
    };
    
    const fetchRecommendations = async () => {
        if (!user) return;
        
        setIsLoading(true);
        setError('');
        setRecommendations([]);
        
        const userData = await getUserData(user.uid);
        const weakestTopics = findWeakestTopics(userData?.roadmap);

        if (weakestTopics.length === 0) {
            setError("Could not determine weakest topics. Complete some roadmap items first!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await getLearningRecommendations({ topics: weakestTopics });
            setRecommendations(response.recommendations);
        } catch (err) {
            console.error(err);
            setError('Could not fetch AI recommendations. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <Card className="bg-secondary/50 dark:bg-secondary/20 border-primary/20 card-glow-effect">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-primary" />
                                <span className="font-headline">AI-Powered Recommendations</span>
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Based on your roadmap progress, here are some personalized suggestions to focus on.
                            </CardDescription>
                        </div>
                        <Button onClick={fetchRecommendations} disabled={isLoading || authLoading} className="mt-2 md:mt-0 md:flex-shrink-0">
                             {isLoading ? 'Analyzing...' : 'Get Suggestions'}
                        </Button>
                    </div>
                </CardHeader>
                 {(isLoading || recommendations.length > 0 || error) && (
                    <CardContent>
                        {isLoading && (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        )}
                        {error && (
                             <div className="flex items-center gap-2 text-destructive font-medium">
                                <AlertTriangle className="h-5 w-5" />
                                <p>{error}</p>
                            </div>
                        )}
                        {recommendations.length > 0 && (
                            <div className="space-y-6">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                                            <Lightbulb className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-primary font-headline">{rec.topic}</h4>
                                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: rec.recommendation.replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </section>
    );
}
