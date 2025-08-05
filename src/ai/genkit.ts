import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Please make sure it is set in your .env file.");
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY
  })],
});
