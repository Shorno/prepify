import { z } from "zod";

/**
 * Zod schema defining the structured output format for AI explanations.
 * Used by the Vercel AI SDK's generateObject() to enforce and validate
 * the response shape from any AI model.
 */
export const explanationSchema = z.object({
    summary: z.string().describe(
        "A concise 1-2 sentence summary of what this handwritten note covers and the problem it solves"
    ),
    steps: z.array(
        z.object({
            stepNumber: z.number().describe("Sequential step number starting from 1"),
            title: z.string().describe("A short title for this step"),
            content: z.string().describe(
                "Detailed explanation of what happens in this step, including any formulas or reasoning"
            ),
        })
    ).describe("Step-by-step breakdown of the solution approach shown in the handwritten notes"),
    keyConcepts: z.array(
        z.object({
            name: z.string().describe("Name of the concept, formula, theorem, or algorithm"),
            description: z.string().describe("Brief explanation of what it is and how it is used in this solution"),
        })
    ).describe("Key formulas, theorems, algorithms, or concepts identified in the notes"),
    observations: z.string().nullable().describe(
        "Any potential errors, alternative approaches, assumptions made, or important notes about the solution. Null if none."
    ),
    topics: z.array(z.string()).describe(
        "3-8 auto-generated topic tags relevant to this note (e.g., 'Binary Search Tree', 'Recursion', 'Integration')"
    ),
});

export type AIExplanationOutput = z.infer<typeof explanationSchema>;
