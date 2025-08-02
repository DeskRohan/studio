
'use server';
/**
 * @fileOverview Provides learning recommendations based on a user's weakest topics.
 *
 * - getLearningRecommendations - A function that returns personalized recommendations.
 * - LearningRecommendationsInput - The input type for the getLearningRecommendations function.
 * - LearningRecommendationsOutput - The return type for the getLearningRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LearningRecommendationsInputSchema = z.object({
  topics: z.array(z.string()).describe("A list of the user's weakest topics, e.g., ['Arrays', 'Graphs', 'DP']."),
});
export type LearningRecommendationsInput = z.infer<typeof LearningRecommendationsInputSchema>;

const LearningRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.object({
    topic: z.string().describe("The topic the recommendation is for."),
    recommendation: z.string().describe("A concise, actionable recommendation formatted as simple HTML. Use <b> tags for emphasis. Provide 1-2 sentences."),
  })).describe("An array of personalized learning recommendations."),
});
export type LearningRecommendationsOutput = z.infer<typeof LearningRecommendationsOutputSchema>;

export async function getLearningRecommendations(input: LearningRecommendationsInput): Promise<LearningRecommendationsOutput> {
  return getLearningRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningRecommendationsPrompt',
  input: { schema: LearningRecommendationsInputSchema },
  output: { schema: LearningRecommendationsOutputSchema },
  prompt: `You are an expert career coach for software engineers. A student needs help focusing their studies.
Based on their weakest topics, provide a concise, actionable recommendation for each one.
Keep the advice practical and encouraging. Focus on a specific strategy or type of problem they should tackle.
Format the output as simple HTML, using <b> tags to highlight key concepts or problem names. Do not use markdown.

Weakest Topics:
{{#each topics}}
- {{{this}}}
{{/each}}
`,
});

const getLearningRecommendationsFlow = ai.defineFlow(
  {
    name: 'getLearningRecommendationsFlow',
    inputSchema: LearningRecommendationsInputSchema,
    outputSchema: LearningRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
