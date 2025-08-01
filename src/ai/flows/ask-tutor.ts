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
  answer: z.string().describe('The answer to the user\'s question.'),
});
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  return askTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askTutorPrompt',
  input: { schema: AskTutorInputSchema },
  output: { schema: AskTutorOutputSchema },
  prompt: `You are an expert tutor for Computer Science students specializing in Data Structures and Algorithms. A student has a question. Provide a clear, concise, and accurate answer.

Keep the answer simple and to the point. Do not provide code examples unless absolutely necessary.

Question: {{{question}}}`,
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
