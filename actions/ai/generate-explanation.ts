"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { aiExplanation, type AIExplanationRecord } from "@/db/schema/ai-explanation";
import { note, file } from "@/db/schema/note";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq } from "drizzle-orm";
import { generateNoteExplanation } from "@/lib/ai/explain";
import { MODEL_DISPLAY_NAME } from "@/lib/ai/provider";

const MAX_REGENERATIONS = 3;

export async function generateExplanation(
    noteId: number
): Promise<ActionResult<AIExplanationRecord>> {
    try {
        // 1. Auth check
        const session = await checkAuth();
        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to generate explanations",
            };
        }

        // 2. Verify the user is the note uploader
        const targetNote = await db.query.note.findFirst({
            where: eq(note.id, noteId),
            with: {
                course: true,
                files: true,
            },
        });

        if (!targetNote) {
            return {
                status: 404,
                success: false,
                error: "Note not found",
            };
        }

        if (targetNote.userId !== session.user.id) {
            return {
                status: 403,
                success: false,
                error: "Only the note uploader can generate AI explanations",
            };
        }

        if (targetNote.status !== "approved") {
            return {
                status: 400,
                success: false,
                error: "AI explanations can only be generated for approved notes",
            };
        }

        if (targetNote.files.length === 0) {
            return {
                status: 400,
                success: false,
                error: "This note has no files to analyze",
            };
        }

        // 3. Check regeneration cap
        const existingExplanation = await db.query.aiExplanation.findFirst({
            where: eq(aiExplanation.noteId, noteId),
        });

        if (existingExplanation && existingExplanation.regenerateCount >= MAX_REGENERATIONS) {
            return {
                status: 429,
                success: false,
                error: `Maximum regeneration limit (${MAX_REGENERATIONS}) reached for this note`,
            };
        }

        const regenerateCount = existingExplanation
            ? existingExplanation.regenerateCount + 1
            : 0;

        // 4. Upsert with "generating" status
        let recordId: number;
        if (existingExplanation) {
            await db.update(aiExplanation)
                .set({
                    status: "generating",
                    updatedAt: new Date(),
                    regenerateCount,
                })
                .where(eq(aiExplanation.id, existingExplanation.id));
            recordId = existingExplanation.id;
        } else {
            const [inserted] = await db.insert(aiExplanation)
                .values({
                    noteId,
                    status: "generating",
                    regenerateCount: 0,
                })
                .returning({ id: aiExplanation.id });
            recordId = inserted.id;
        }

        // 5. Get image URLs
        const imageUrls = targetNote.files.map(f => f.url);

        // 6. Call AI
        const aiResult = await generateNoteExplanation(
            imageUrls,
            targetNote.course.name
        );

        // 7. Update with results
        await db.update(aiExplanation)
            .set({
                summary: aiResult.summary,
                steps: aiResult.steps,
                keyConcepts: aiResult.keyConcepts,
                observations: aiResult.observations,
                topics: aiResult.topics,
                modelUsed: MODEL_DISPLAY_NAME,
                status: "ready",
                generatedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(aiExplanation.id, recordId));

        // 8. Fetch and return the complete record
        const result = await db.query.aiExplanation.findFirst({
            where: eq(aiExplanation.id, recordId),
        });

        return {
            status: 200,
            success: true,
            data: result!,
            message: regenerateCount > 0
                ? "Explanation regenerated successfully"
                : "Explanation generated successfully",
        };
    } catch (error) {
        console.error("Error generating AI explanation:", error);

        // Try to mark as failed if we have a noteId
        try {
            await db.update(aiExplanation)
                .set({ status: "failed", updatedAt: new Date() })
                .where(eq(aiExplanation.noteId, noteId));
        } catch {
            // Ignore cleanup errors
        }

        return {
            status: 500,
            success: false,
            error: "Failed to generate AI explanation. Please try again.",
        };
    }
}
