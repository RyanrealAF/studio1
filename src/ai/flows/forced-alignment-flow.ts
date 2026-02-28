'use server';
/**
 * @fileOverview This file implements a Genkit flow for forced alignment of vocal audio with lyrics.
 *
 * - forcedAlignment - A function that aligns an audio track with its corresponding lyrics to generate word-level timestamps.
 * - ForcedAlignmentInput - The input type for the forcedAlignment function.
 * - ForcedAlignmentOutput - The return type for the forcedAlignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForcedAlignmentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A vocal audio track, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  lyrics: z.string().describe('The lyrics corresponding to the audio track.'),
});
export type ForcedAlignmentInput = z.infer<typeof ForcedAlignmentInputSchema>;

const AlignedWordSchema = z.object({
  word: z.string().describe('The word from the lyrics.'),
  startTime: z.number().describe('The start time of the word in the audio, in seconds.'),
  endTime: z.number().describe('The end time of the word in the audio, in seconds.'),
});

const ForcedAlignmentOutputSchema = z.object({
  alignedWords: z.array(AlignedWordSchema).describe('An array of words with their precise start and end timestamps.'),
});
export type ForcedAlignmentOutput = z.infer<typeof ForcedAlignmentOutputSchema>;

// Simulate an external forced alignment tool like WhisperX.
// In a real application, this would call an external service or library.
const forcedAlignmentTool = ai.defineTool(
  {
    name: 'alignAudioWithLyrics',
    description: 'Aligns an audio track with its corresponding lyrics to generate word-level timestamps.',
    inputSchema: ForcedAlignmentInputSchema,
    outputSchema: ForcedAlignmentOutputSchema,
  },
  async ({lyrics}) => {
    // This is a mock implementation. In a real scenario, this would involve
    // sending the audio and lyrics to a robust forced alignment service
    // (e.g., a hosted WhisperX instance or a dedicated cloud AI service).

    const words = lyrics.split(/\s+/).filter(Boolean);
    const alignedWords: z.infer<typeof AlignedWordSchema>[] = [];
    let currentTime = 0.0;

    for (const word of words) {
      // Simulate arbitrary durations for words
      const duration = word.length * 0.08 + Math.random() * 0.1; // Longer words take more time
      const startTime = parseFloat(currentTime.toFixed(2));
      currentTime += duration;
      const endTime = parseFloat(currentTime.toFixed(2));
      currentTime += 0.05; // Simulate a small pause between words

      alignedWords.push({
        word,
        startTime,
        endTime,
      });
    }

    return {alignedWords};
  }
);

const forcedAlignmentFlow = ai.defineFlow(
  {
    name: 'forcedAlignmentFlow',
    inputSchema: ForcedAlignmentInputSchema,
    outputSchema: ForcedAlignmentOutputSchema,
  },
  async (input) => {
    // Directly call the simulated forced alignment tool.
    // An LLM is not needed to decide *if* to call this tool, as the user explicitly
    // requests forced alignment by providing audio and lyrics.
    const result = await forcedAlignmentTool(input);
    return result;
  }
);

export async function forcedAlignment(
  input: ForcedAlignmentInput
): Promise<ForcedAlignmentOutput> {
  return forcedAlignmentFlow(input);
}
