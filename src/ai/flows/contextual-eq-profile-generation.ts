'use server';
/**
 * @fileOverview A Genkit flow for generating an EQ profile and audio processing parameters
 * based on a textual description of a desired production context.
 *
 * - contextualEqProfileGeneration - A function that handles the generation process.
 * - ContextualEqProfileGenerationInput - The input type for the function.
 * - ContextualEqProfileGenerationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EqBandSchema = z.object({
  type: z.enum(['lowcut', 'highshelf', 'peak', 'lowshelf', 'highcut']).describe('Type of EQ band.'),
  frequency: z.number().describe('Center frequency in Hz.'),
  gain: z.number().describe('Gain in dB.'),
  q: z.number().optional().describe('Q factor for peak filters or slope for shelves/cuts.'),
});

const CompressorSettingsSchema = z.object({
  threshold: z.number().describe('Threshold in dB (e.g., -24).'),
  ratio: z.string().describe('Ratio (e.g., "4:1").'),
  attack: z.number().describe('Attack time in ms (e.g., 5).'),
  release: z.number().describe('Release time in ms (e.g., 100).'),
  makeupGain: z.number().describe('Makeup gain in dB (e.g., 3).'),
});

const ReverbSettingsSchema = z.object({
  type: z.enum(['hall', 'room', 'plate', 'spring', 'gated', 'delay']).describe('Type of reverb/delay effect.'),
  dryWet: z.number().describe('Dry/Wet mix percentage (0-100).'),
  decayTime: z.number().describe('Decay time in seconds (e.g., 2.5).'),
  preDelay: z.number().optional().describe('Pre-delay time in ms.'),
});

const ContextualEqProfileGenerationInputSchema = z.object({
  productionContext: z
    .string()
    .describe(
      "A textual description of the desired audio production context and sonic qualities (e.g., 'grimy boom-bap', 'clean and present', 'punchy modern pop')."
    ),
});
export type ContextualEqProfileGenerationInput = z.infer<
  typeof ContextualEqProfileGenerationInputSchema
>;

const ContextualEqProfileGenerationOutputSchema = z.object({
  recommendedEqProfile: z.array(EqBandSchema).describe('An array of recommended EQ bands with their settings.'),
  compressorSettings: CompressorSettingsSchema.optional().describe('Recommended compressor settings.'),
  reverbSettings: ReverbSettingsSchema.optional().describe('Recommended reverb/delay settings.'),
  otherProcessingNotes: z
    .string()
    .optional()
    .describe('Any other general audio processing notes or recommendations (e.g., saturation, parallel compression, transient shaping).'),
});
export type ContextualEqProfileGenerationOutput = z.infer<
  typeof ContextualEqProfileGenerationOutputSchema
>;

export async function contextualEqProfileGeneration(
  input: ContextualEqProfileGenerationInput
): Promise<ContextualEqProfileGenerationOutput> {
  return contextualEqProfileGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualEqProfileGenerationPrompt',
  input: {schema: ContextualEqProfileGenerationInputSchema},
  output: {schema: ContextualEqProfileGenerationOutputSchema},
  prompt: `You are an expert audio engineer specializing in vocal mixing and production.

Given the following desired production context, generate a detailed EQ profile and other relevant audio processing parameters for a lead vocal. Provide the output in a structured JSON format.

Be specific with frequencies, gains, Q factors, and other settings. If a parameter is not applicable, omit it.

Production Context: {{{productionContext}}}`,
});

const contextualEqProfileGenerationFlow = ai.defineFlow(
  {
    name: 'contextualEqProfileGenerationFlow',
    inputSchema: ContextualEqProfileGenerationInputSchema,
    outputSchema: ContextualEqProfileGenerationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
