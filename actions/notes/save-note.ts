"use server"

import {NoteFormData, noteSchema} from "@/zodSchema/noteSchema";
import {checkAuth} from "@/app/actions/user/checkAuth";
import {ActionResult} from "@/types/action-response";
import {note, file, resource} from "@/db/schema/note";
import {calculateNotePoints, POINTS_CONFIG} from "@/lib/points-config";
import {eq} from "drizzle-orm";
import {db} from "@/db/config";
import {pointsTransaction, userPoints} from "@/db/schema/leaderboard";
import {z} from "zod";
import {sendPointsEmail} from "@/actions/email/send-points-email";

export default async function saveNote(data: NoteFormData): Promise<ActionResult<{
    noteId: number;
    pointsEarned: number;
    totalPoints: number;
    nextMilestone?: {count: number; points: number; remaining: number};
}>> {

    const session = await checkAuth()

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = noteSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data;

        const {savedNote, pointsEarned, totalPoints, nextMilestone} = await db.transaction(async (tx) => {
            // Check if this is user's first note (check actual notes, not points record)
            const existingNotes = await tx.query.note.findMany({
                where: (note, {eq}) => eq(note.userId, session.user.id),
            });
            const isFirstNote = existingNotes.length === 0;
            const newNoteCount = existingNotes.length + 1;

            // Insert the note
            const [newNote] = await tx.insert(note).values({
                title: validData.title,
                courseId: parseInt(validData.courseId),
                departmentId: parseInt(validData.departmentId),
                facultyId: parseInt(validData.facultyId),
                userId: session.user.id,
            }).returning();

            if (!newNote) {
                throw new Error("Failed to create note");
            }

            // Insert files if any
            if (validData.files && validData.files.length > 0) {
                const fileValues = validData.files.map((fileUrl) => ({
                    url: fileUrl,
                    noteId: newNote.id,
                }));
                await tx.insert(file).values(fileValues);
            }

            // Insert resources if any
            if (validData.resources && validData.resources.length > 0) {
                const resourceValues = validData.resources.map((res) => ({
                    url: res.url,
                    noteId: newNote.id,
                }));
                await tx.insert(resource).values(resourceValues);
            }

            // Calculate points for the note
            const pointsCalculation = calculateNotePoints({
                files: validData.files || [],
                resources: validData.resources?.length || 0,
                isFirstNote,
            });

            // Check for milestone achievements
            const milestonePoints = checkMilestone(newNoteCount);
            const totalPointsEarned = pointsCalculation.total + milestonePoints;

            // Create all points transactions
            const transactionValues = pointsCalculation.breakdown.map((item) => ({
                userId: session.user.id,
                noteId: newNote.id,
                points: item.points,
                reason: item.reason,
            }));

            // Add milestone transaction if applicable
            if (milestonePoints > 0) {
                transactionValues.push({
                    userId: session.user.id,
                    noteId: newNote.id,
                    points: milestonePoints,
                    reason: `Milestone: ${newNoteCount} notes`,
                });
            }

            await tx.insert(pointsTransaction).values(transactionValues);

            // Get or create user points record
            // Get or create user points record
            const existingUserPoints = await tx.query.userPoints.findFirst({
                where: (up, {eq}) => eq(up.userId, session.user.id),
            });
            let newTotalPoints: number;

            if (existingUserPoints) {
                // Update existing record
                newTotalPoints = existingUserPoints.totalPoints + totalPointsEarned;

                await tx.update(userPoints)
                    .set({
                        totalPoints: newTotalPoints,
                        notesCreated: newNoteCount,
                        updatedAt: new Date(),
                    })
                    .where(eq(userPoints.userId, session.user.id));
            } else {
                // Create new record
                newTotalPoints = totalPointsEarned;

                await tx.insert(userPoints).values({
                    userId: session.user.id,
                    totalPoints: newTotalPoints,
                    notesCreated: 1,
                });
            }

            // Calculate next milestone
            const nextMilestoneInfo = getNextMilestone(newNoteCount);


            await sendPointsEmail({
                userEmail: session.user.email!,
                userName: session.user.name,
                totalPointsEarned,
                newTotalPoints,
                newNoteCount,
                breakdown: pointsCalculation.breakdown,
                nextMilestone: nextMilestoneInfo,
            });

            return {
                savedNote: newNote,
                pointsEarned: totalPointsEarned,
                totalPoints: newTotalPoints,
                nextMilestone: nextMilestoneInfo,
            };
        });

        return {
            success: true,
            status: 201,
            data: {
                noteId: savedNote.id,
                pointsEarned,
                totalPoints,
                nextMilestone,
            },
            message: `Note saved successfully! You earned ${pointsEarned} points! 🎉`,
        };

    } catch (error) {
        console.error("Error saving note:", error);

        if (error instanceof Error) {
            if (error.message.includes("unique constraint")) {
                return {
                    success: false,
                    status: 409,
                    error: "A note with this title already exists",
                };
            }

            if (error.message.includes("foreign key constraint")) {
                return {
                    success: false,
                    status: 400,
                    error: "Invalid course, department, faculty, or user ID",
                };
            }
        }

        return {
            success: false,
            status: 500,
            error: "Failed to save note. Please try again.",
        };
    }
}

function checkMilestone(noteCount: number): number {
    const milestones: Record<number, number> = {
        5: POINTS_CONFIG.MILESTONE_5_NOTES,
        10: POINTS_CONFIG.MILESTONE_10_NOTES,
        25: POINTS_CONFIG.MILESTONE_25_NOTES,
        50: POINTS_CONFIG.MILESTONE_50_NOTES,
    };

    return milestones[noteCount] || 0;
}

function getNextMilestone(currentNoteCount: number): {count: number; points: number; remaining: number} | undefined {
    const milestones = [
        { count: 5, points: POINTS_CONFIG.MILESTONE_5_NOTES },
        { count: 10, points: POINTS_CONFIG.MILESTONE_10_NOTES },
        { count: 25, points: POINTS_CONFIG.MILESTONE_25_NOTES },
        { count: 50, points: POINTS_CONFIG.MILESTONE_50_NOTES },
    ];

    const nextMilestone = milestones.find(m => m.count > currentNoteCount);

    if (!nextMilestone) return undefined;

    return {
        count: nextMilestone.count,
        points: nextMilestone.points,
        remaining: nextMilestone.count - currentNoteCount,
    };
}