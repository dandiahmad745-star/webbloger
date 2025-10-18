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
