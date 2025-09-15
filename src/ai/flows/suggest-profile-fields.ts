'use server';

/**
 * @fileOverview Suggests relevant profile fields based on the user's job title or industry.
 *
 * - suggestProfileFields - A function that suggests profile fields.
 * - SuggestProfileFieldsInput - The input type for the suggestProfileFields function.
 * - SuggestProfileFieldsOutput - The return type for the suggestProfileFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileFieldsInputSchema = z.object({
  jobTitle: z
    .string()
    .describe('The job title of the user.'),
  industry: z
    .string()
    .describe('The industry of the user.'),
});
export type SuggestProfileFieldsInput = z.infer<typeof SuggestProfileFieldsInputSchema>;

const SuggestProfileFieldsOutputSchema = z.object({
  suggestedFields: z.array(z.string()).describe('An array of suggested profile fields.'),
});
export type SuggestProfileFieldsOutput = z.infer<typeof SuggestProfileFieldsOutputSchema>;

export async function suggestProfileFields(input: SuggestProfileFieldsInput): Promise<SuggestProfileFieldsOutput> {
  return suggestProfileFieldsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileFieldsPrompt',
  input: {schema: SuggestProfileFieldsInputSchema},
  output: {schema: SuggestProfileFieldsOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant profile fields based on the user's job title and industry.

Job Title: {{{jobTitle}}}
Industry: {{{industry}}}

Suggest at least 5 profile fields that would be relevant for this user. Consider fields like:
- LinkedIn profile
- Twitter/X profile
- GitHub profile
- Personal website
- Contact email
- Portfolio
- Location
- Skills
- Education
- Experience

Return the suggested fields as a JSON array of strings. Do not include any additional text or explanations. Focus only on field suggestions relevant to the job title and industry provided.

Example:
["LinkedIn profile", "Personal website", "Contact email", "Portfolio", "Skills"]

Make sure the fields are relevant to the job title and industry.
`,
});

const suggestProfileFieldsFlow = ai.defineFlow(
  {
    name: 'suggestProfileFieldsFlow',
    inputSchema: SuggestProfileFieldsInputSchema,
    outputSchema: SuggestProfileFieldsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
