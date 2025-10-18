'use server';
/**
 * @fileOverview A flow to generate a coffee recipe based on user input.
 *
 * - generateRecipe - A function that handles the recipe generation.
 */

import { ai } from '@/ai/genkit';
import { CoffeeRecipeSchema, GenerateRecipeInputSchema, type GenerateRecipeOutput, type GenerateRecipeInput } from './recipe-schema';

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: { schema: GenerateRecipeInputSchema },
  output: { schema: CoffeeRecipeSchema },
  prompt: `You are an expert barista and recipe creator. A user wants a coffee recipe.
Generate a creative and delicious coffee recipe based on the user's request.
The user's request is: "{{topic}}".

Follow these rules:
1.  The entire response must be in Bahasa Indonesia.
2.  The 'id' must be a unique, URL-friendly slug based on the recipe name.
3.  The 'category' should be a plausible geographical location (City, Country) related to coffee.
4.  The 'imageId' must be one of the following exact values: profile-picture, coffee-journey, coffee-journey-alt, barista-story, coffee-utensils, gayo-beans, kintamani-beans, sidamo-beans, lampung-beans, colombia-beans, java-beans, espresso-shot. Choose the most visually appropriate one.
5.  All fields are mandatory.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: CoffeeRecipeSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a recipe.');
    }
    // Make ID even more unique to avoid collisions in localStorage
    output.id = `${output.id}-${Date.now()}`;
    return output;
  }
);
