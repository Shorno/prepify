import { generateObject } from "ai";
import { aiModel } from "./provider";
import { explanationSchema, type AIExplanationOutput } from "./schemas";

/**
 * Generate a structured AI explanation for handwritten note images.
 * Uses the Vercel AI SDK's generateObject() for type-safe structured output.
 * The underlying model is determined by lib/ai/provider.ts.
 */
export async function generateNoteExplanation(
    imageUrls: string[],
    courseName: string
): Promise<AIExplanationOutput> {
    const { object } = await generateObject({
        model: aiModel,
        schema: explanationSchema,
        messages: [
            {
                role: "system",
                content: `You are an expert academic tutor specialized in analyzing handwritten student notes and solutions.

CONTEXT:
- These are handwritten academic notes/solutions from a university course: "${courseName}"
- The images are sequential pages of ONE cohesive solution or set of notes
- The content may be in English, Bangla, or a mix of both

YOUR TASK:
- Analyze ALL images together as one complete solution
- Provide a clear, educational explanation that helps students understand the approach
- Identify each step of the solution process
- List key formulas, theorems, or concepts used
- Note any potential errors, alternative approaches, or important observations
- Generate relevant topic tags for discoverability

GUIDELINES:
- Be educational and encouraging in tone
- If handwriting is partially illegible, explain what you can read and note unclear parts
- Reference specific pages when relevant (e.g., "In page 2, the student applies...")
- Keep step explanations clear and concise but thorough
- For mathematical content, describe formulas in plain text (e.g., "the quadratic formula: x = (-b ± √(b²-4ac)) / 2a")`
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Please analyze these ${imageUrls.length} page(s) of handwritten notes from "${courseName}" and provide a structured explanation.`
                    },
                    ...imageUrls.map(url => ({
                        type: "image" as const,
                        image: new URL(url),
                    })),
                ]
            }
        ],
    });

    return object;
}
