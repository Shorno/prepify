"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { aiExplanation, type AIExplanationRecord } from "@/db/schema/ai-explanation";
import { eq } from "drizzle-orm";

export async function getExplanation(
    noteId: number
): Promise<ActionResult<AIExplanationRecord | null>> {
    try {
        const explanation = await db.query.aiExplanation.findFirst({
            where: eq(aiExplanation.noteId, noteId),
        });

        return {
            status: 200,
            success: true,
            data: explanation ?? null,
        };
    } catch (error) {
        console.error("Error fetching AI explanation:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to fetch AI explanation",
        };
    }
}
