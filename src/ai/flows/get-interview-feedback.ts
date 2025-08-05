'use server';
/**
 * @fileOverview Provides feedback on a user's answer to an interview question.
 *
 * - getInterviewFeedback - A function that returns feedback for a given question and answer.
 * - InterviewFeedbackInput - The input type for the getInterviewFeedback function.
 * - InterviewFeedbackOutput - The return type for the getInterviewFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterviewFeedbackInputSchema = z.object({
  question: z.string().describe("The interview question that was asked."),
  answer: z.string().describe("The user's answer to the question."),
});
export type InterviewFeedbackInput = z.infer<typeof InterviewFeedbackInputSchema>;

const InterviewFeedbackOutputSchema = z.object({
  feedback: z.string().describe("Constructive feedback on the user's answer, formatted as HTML with bold tags for emphasis."),
});
export type InterviewFeedbackOutput = z.infer<typeof InterviewFeedbackOutputSchema>;

export async function getInterviewFeedback(input: InterviewFeedbackInput): Promise<InterviewFeedbackOutput> {
  return getInterviewFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewFeedbackPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: InterviewFeedbackInputSchema },
  output: { schema: InterviewFeedbackOutputSchema },
  prompt: `You are an expert career coach for software engineers. A student is practicing for an interview.
Provide constructive feedback on their answer to a common interview question.

Analyze the answer based on clarity, structure (like the STAR method if applicable), and content.
Provide actionable suggestions for improvement. Keep the feedback concise and encouraging.
Format the feedback as simple HTML, using <b> tags to highlight key points or suggestions. Do not use markdown.

Interview Question: {{{question}}}
Student's Answer: {{{answer}}}
`,
});

const getInterviewFeedbackFlow = ai.defineFlow(
  {
    name: 'getInterviewFeedbackFlow',
    inputSchema: InterviewFeedbackInputSchema,
    outputSchema: InterviewFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
