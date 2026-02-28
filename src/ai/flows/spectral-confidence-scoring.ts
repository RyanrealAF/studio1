'use server';
/**
 * @fileOverview A Genkit flow for analyzing the spectral confidence of articulated words in vocal audio.
 *
 * - scoreSpectralConfidence - A function that takes aligned lyrics, audio, and word timestamps to
 *   identify words needing vocal repair based on spectral confidence.
 * - SpectralConfidenceScoringInput - The input type for the scoreSpectralConfidence function.
 * - SpectralConfidenceScoringOutput - The return type for the scoreSpectralConfidence function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the spectral confidence scoring flow
const SpectralConfidenceScoringInputSchema = z.object({
  lyrics: z.string().describe('The full lyrics of the vocal track.'),
  audioDataUri: z
    .string()
    .describe(
      "The vocal audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  wordTimestamps: z
    .array(
      z.object({
        word: z.string().describe('The articulated word.'),
        startTime: z.number().describe('Start time of the word in seconds.'),
        endTime: z.number().describe('End time of the word in seconds.'),
      })
    )
    .describe(
      'An array of objects, each containing a word and its start and end timestamps from forced alignment.'
    ),
});
export type SpectralConfidenceScoringInput = z.infer<
  typeof SpectralConfidenceScoringInputSchema
>;

// Output schema for the spectral confidence scoring flow
const SpectralConfidenceScoringOutputSchema = z.object({
  wordConfidenceScores: z
    .array(
      z.object({
        word: z.string().describe('The articulated word.'),
        startTime: z.number().describe('Start time of the word in seconds.'),
        endTime: z.number().describe('End time of the word in seconds.'),
        confidenceScore: z
          .number()
          .min(0)
          .max(100)
          .describe(
            'A confidence score (0-100) indicating the clarity, articulation, and presence of the word in the audio. Higher is better.'
          ),
        needsRepair: z
          .boolean()
          .describe(
            'True if the word likely requires vocal repair or adjustment due to low confidence.'
          ),
      })
    )
    .describe('An array of words with their calculated confidence scores and repair flags.').refine(arr => arr.length > 0, { message: 'wordConfidenceScores array cannot be empty.'}),
});
export type SpectralConfidenceScoringOutput = z.infer<
  typeof SpectralConfidenceScoringOutputSchema
>;

export async function scoreSpectralConfidence(
  input: SpectralConfidenceScoringInput
): Promise<SpectralConfidenceScoringOutput> {
  return spectralConfidenceScoringFlow(input);
}

// Define the prompt for the spectral confidence scoring
const spectralConfidencePrompt = ai.definePrompt({
  name: 'spectralConfidencePrompt',
  input: { schema: SpectralConfidenceScoringInputSchema },
  output: { schema: SpectralConfidenceScoringOutputSchema },
  // Using a multimodal model like Gemini 1.5 Flash/Pro is crucial for audio analysis.
  // The global ai object is configured with 'googleai/gemini-2.5-flash', which supports audio.
  model: 'googleai/gemini-1.5-flash', // Explicitly using 1.5-flash for its strong multimodal capabilities with audio
  prompt: `You are an expert audio engineer and vocal producer. Your task is to analyze a vocal audio track against its provided lyrics and word-level timestamps.
For each word, evaluate its clarity, articulation, and overall presence in the audio. Assign a confidence score from 0 (very unclear, needs significant repair) to 100 (perfectly clear, no repair needed).
Based on this confidence score, determine if the word 'needs repair'. A word needs repair if its clarity, articulation, or presence is significantly compromised. Typically, a score below 60 might indicate a need for repair.

Here are the full lyrics:
```
{{{lyrics}}}
```

Here are the word-level timestamps for your analysis:
```json
{{{json wordTimestamps}}}
```

Analyze the audio provided. Focus your analysis on the specific audio segments for each word as indicated by the 'startTime' and 'endTime' in the wordTimestamps.

{{media url=audioDataUri}}

Provide the output as a JSON array of objects, strictly following the output schema.`,
});

// Define the Genkit flow
const spectralConfidenceScoringFlow = ai.defineFlow(
  {
    name: 'spectralConfidenceScoringFlow',
    inputSchema: SpectralConfidenceScoringInputSchema,
    outputSchema: SpectralConfidenceScoringOutputSchema,
  },
  async (input) => {
    const { output } = await spectralConfidencePrompt(input);
    return output!;
  }
);
