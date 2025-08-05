
'use server';
/**
 * @fileOverview A simple AI tutor for DSA questions.
 *
 * - askTutor - A function that answers a user's question.
 * - AskTutorInput - The input type for the askTutor function.
 * - AskTutorOutput - The return type for the askTutor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskTutorInputSchema = z.object({
  question: z.string().describe('The user\'s question about DSA.'),
});
export type AskTutorInput = z.infer<typeof AskTutorInputSchema>;

const AskTutorOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\'s question, formatted as Markdown.'),
});
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  return askTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askTutorPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: AskTutorInputSchema },
  output: { schema: AskTutorOutputSchema },
  prompt: `You are Niva, an expert AI assistant and tutor for Computer Science students. You are embedded in a web application called "NextGenSDE".

Your primary role is to answer questions about Data Structures & Algorithms (DSA) and other computer science concepts. Provide clear, concise, and accurate answers. Format your response using Markdown, including code blocks with language identifiers (e.g., \`\`\`javascript) when necessary.

You should also be able to answer questions about the NextGenSDE application itself. Here is some information about it:
- **Purpose:** NextGenSDE is a personalized placement preparation tool for Computer Science students, created by Rohan Godakhindi.
- **Key Features:**
  - **Dashboard:** An overview of the user's progress, including topics completed, current day streak, and consistency.
  - **My Study Roadmap:** A structured, phase-by-phase guide to learning DSA and other CS subjects. Users can track their progress by checking off topics and updating practice problem counts.
  - **Question Bank:** A curated list of practice problems from sites like LeetCode, filterable by topic and difficulty.
  - **Resources:** A handpicked collection of high-quality learning materials (videos, articles, etc.) and AI-powered recommendations for weaker topics.
  - **AI Interviewer:** A tool to practice answering common behavioral and technical interview questions and get instant AI feedback.
  - **The Architect:** A page about the creator of the application, Rohan Godakhindi.
  - **Niva (You):** An AI-powered doubt solver for quick questions.

When answering, be friendly, encouraging, and helpful.

User's Question: {{{question}}}`,
});

const askTutorFlow = ai.defineFlow(
  {
    name: 'askTutorFlow',
    inputSchema: AskTutorInputSchema,
    outputSchema: AskTutorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
