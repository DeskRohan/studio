// src/ai/flows/recommend-targeted-resources.ts
'use server';

/**
 * @fileOverview Recommends practice questions and topics based on the user's progress and the placement syllabus.
 *
 * - recommendTargetedResources - A function that handles the recommendation process.
 * - RecommendTargetedResourcesInput - The input type for the recommendTargetedResources function.
 * - RecommendTargetedResourcesOutput - The return type for the recommendTargetedResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTargetedResourcesInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('List of skills the user already possesses.'),
  knowledgeGaps: z
    .array(z.string())
    .describe('List of topics where the user has knowledge gaps.'),
  placementSyllabus: z
    .string()
    .describe('The syllabus of the placement program.'),
  userHistory: z
    .string()
    .describe('The user history including past tests and their scores'),
});
export type RecommendTargetedResourcesInput = z.infer<
  typeof RecommendTargetedResourcesInputSchema
>;

const RecommendTargetedResourcesOutputSchema = z.object({
  recommendedTopics: z
    .array(z.string())
    .describe('List of recommended topics to study.'),
  recommendedQuestions: z
    .array(z.string())
    .describe('List of recommended practice question IDs.'),
});
export type RecommendTargetedResourcesOutput = z.infer<
  typeof RecommendTargetedResourcesOutputSchema
>;

export async function recommendTargetedResources(
  input: RecommendTargetedResourcesInput
): Promise<RecommendTargetedResourcesOutput> {
  return recommendTargetedResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTargetedResourcesPrompt',
  input: {schema: RecommendTargetedResourcesInputSchema},
  output: {schema: RecommendTargetedResourcesOutputSchema},
  prompt: `You are an AI assistant designed to recommend practice questions and topics for placement exams.

  Based on the user's skills, knowledge gaps, the placement program's syllabus, and user history, recommend topics and practice questions.

  Skills: {{userSkills}}
  Knowledge Gaps: {{knowledgeGaps}}
  Placement Syllabus: {{placementSyllabus}}
  User History: {{userHistory}}

  Consider various difficulty levels and the student's history to focus on areas most likely to need work.

  Output the recommended topics and practice question IDs.
  Make sure the "recommendedQuestions" field contains question IDs, not the actual questions.
  `,
});

const recommendTargetedResourcesFlow = ai.defineFlow(
  {
    name: 'recommendTargetedResourcesFlow',
    inputSchema: RecommendTargetedResourcesInputSchema,
    outputSchema: RecommendTargetedResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
