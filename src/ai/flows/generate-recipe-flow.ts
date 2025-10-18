
'use server';
/**
 * @fileOverview A flow to generate a coffee recipe based on user input.
 *
 * - generateRecipe - A function that handles the recipe generation.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - CoffeeRecipeSchema - The Zod schema for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the output schema based on the CoffeeRecipe type in data-statis.ts
export const CoffeeRecipeSchema = z.object({
    id: z.string().describe("A unique slug-like ID for the recipe, e.g., 'iced-caramel-macchiato'."),
    name: z.string().describe('The name of the coffee recipe.'),
    description: z.string().describe('A brief, enticing description of the recipe.'),
    taste: z.string().describe('The primary taste profile, e.g., "Sweet, creamy, with a hint of vanilla".'),
    aroma: z.string().describe('The dominant aroma, e.g., "Caramel and freshly brewed coffee".'),
    category: z.string().describe('The geographical origin or category, e.g., "Italia" or "Bandung, Indonesia".'),
    beansUsed: z.string().describe('The recommended type of coffee beans, e.g., "Biji Arabica Gayo".'),
    instructions: z.array(z.string()).describe('A list of step-by-step instructions.'),
    imageId: z.string().describe('An appropriate ID from the provided list for a placeholder image. List: profile-picture, coffee-journey, coffee-journey-alt, barista-story, coffee-utensils, gayo-beans, kintamani-beans, sidamo-beans, lampung-beans, colombia-beans, java-beans, espresso-shot.'),
});
export type GenerateRecipeOutput = z.infer<typeof CoffeeRecipeSchema>;


export const GenerateRecipeInputSchema = z.object({
  topic: z.string().describe('The user\'s request for a coffee recipe, e.g., "buatkan resep es kopi susu"'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;


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
