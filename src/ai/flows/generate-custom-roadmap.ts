
'use server';
/**
 * @fileOverview Generates a custom learning roadmap for a user.
 *
 * - generateCustomRoadmap - A function that creates a personalized study plan.
 * - CustomRoadmapInput - The input type for the generateCustomRoadmap function.
 * - CustomRoadmapOutput - The return type for the generateCustomRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RoadmapTopicSchema = z.object({
  id: z.number().describe("A unique numeric ID for the topic, e.g., 101."),
  text: z.string().describe("The name of the topic, e.g., 'Complexity Analysis: Time, Space, Big-O'."),
  completed: z.boolean().describe("The completion status of the topic, which should always be false initially."),
});

const RoadmapPhaseSchema = z.object({
  id: z.number().describe("A unique numeric ID for the phase, starting from 1."),
  title: z.string().describe("A descriptive title for the phase, e.g., 'PHASE 1: Foundations of DSA & DBMS'."),
  duration: z.string().describe("The estimated duration for this phase, e.g., 'Month 1' or 'Weeks 1-2'."),
  goal: z.string().describe("A concise goal for this phase, e.g., 'Build problem-solving base and master DB fundamentals.'."),
  topics: z.array(RoadmapTopicSchema).describe("An array of topics to be covered in this phase."),
  practiceGoal: z.string().describe("A specific practice goal for this phase, e.g., '50-60 Easy/Medium problems (LeetCode / GFG)'."),
  totalProblems: z.number().int().describe("The total number of problems to solve in this phase."),
  problemsSolved: z.number().int().describe("The number of problems already solved, which should always be 0 initially."),
});

export const CustomRoadmapInputSchema = z.object({
  goal: z.string().describe("The user's primary goal, e.g., 'Placement preparation for a product-based company' or 'GATE exam preparation'."),
  timeline: z.string().describe("The user's available timeline, e.g., '3 months', '6 weeks'."),
});
export type CustomRoadmapInput = z.infer<typeof CustomRoadmapInputSchema>;

export const CustomRoadmapOutputSchema = z.object({
  roadmap: z.array(RoadmapPhaseSchema).describe("The generated roadmap, which is an array of phases."),
});
export type CustomRoadmapOutput = z.infer<typeof CustomRoadmapOutputSchema>;

export async function generateCustomRoadmap(input: CustomRoadmapInput): Promise<CustomRoadmapOutput> {
  return generateCustomRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customRoadmapPrompt',
  input: { schema: CustomRoadmapInputSchema },
  output: { schema: CustomRoadmapOutputSchema },
  prompt: `You are an expert computer science curriculum designer and career coach. Your task is to create a detailed, phase-by-phase learning roadmap for a student based on their specific goal and timeline.

The roadmap should be structured, realistic, and comprehensive. It must cover essential Data Structures & Algorithms (DSA), core CS subjects (like DBMS, OS, CN), and development skills where relevant.

**User's Goal:** {{{goal}}}
**User's Timeline:** {{{timeline}}}

**Instructions:**
1.  **Analyze the Goal:** Tailor the content specifically for the user's goal. For 'placements', include DSA, core subjects, and project development. For 'GATE', focus heavily on core subjects and advanced DSA, with less emphasis on web development.
2.  **Divide into Phases:** Break down the entire timeline into logical, sequential phases. Each phase should have a clear title, duration, and objective.
3.  **Define Topics:** Within each phase, list specific, actionable topics.
4.  **Set Practice Goals:** For each phase, provide a tangible practice goal, including a target number of problems to solve.
5.  **ID and Initial State:** Ensure all `id` fields are unique numbers. All `completed` fields must be `false` and all `problemsSolved` fields must be `0`.
6.  **JSON Output:** You MUST generate the output in the specified JSON format. Do not add any commentary or text outside of the JSON structure.

Generate the roadmap now.`,
});

const generateCustomRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCustomRoadmapFlow',
    inputSchema: CustomRoadmapInputSchema,
    outputSchema: CustomRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
