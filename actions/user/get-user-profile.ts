"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { NotesWithRelations } from "@/db/schema/note";

export interface UserProfile {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        batch: string | null;
        departmentId: string | null;
        facultyId: string | null;
    };
    stats: {
        totalPoints: number;
        notesCreated: number;
        rank: number;
    } | null;
    department: {
        id: number;
        name: string;
        departmentCode: string;
        facultyId: number;
    } | null;
    faculty: {
        id: number;
        name: string;
        facultyCode: string;
    } | null;
    notes: NotesWithRelations[];
}

export async function getUserProfile(userId: string): Promise<ActionResult<UserProfile>> {
    try {
        // Fetch user data
        const userData = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, userId),
        });

        if (!userData) {
            return {
                success: false,
                status: 404,
                error: "User not found",
            };
        }

        // Fetch user points and stats
        const userStats = await db.query.userPoints.findFirst({
            where: (userPoints, { eq }) => eq(userPoints.userId, userId),
        });

        // Fetch department if exists
        let department = null;
        if (userData.departmentId) {
            department = await db.query.department.findFirst({
                where: (dept, { eq }) => eq(dept.id, parseInt(userData.departmentId!)),
            });
        }

        // Fetch faculty if exists
        let faculty = null;
        if (userData.facultyId) {
            faculty = await db.query.faculty.findFirst({
                where: (fac, { eq }) => eq(fac.id, parseInt(userData.facultyId!)),
            });
        }

        // Fetch user's public notes
        const notes = await db.query.note.findMany({
            where: (note, { eq }) => eq(note.userId, userId),
            orderBy: (note, { desc }) => [desc(note.createdAt)],
            with: {
                user: true,
                course: true,
                department: true,
                faculty: true,
                resources: true,
                files: true,
                likes: true,
                comments: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        // Calculate rank if stats exist
        let rank = 0;
        if (userStats) {
            const allUsers = await db.query.userPoints.findMany({
                orderBy: (userPoints, { desc }) => [desc(userPoints.totalPoints)],
            });
            rank = allUsers.findIndex(u => u.userId === userId) + 1;
        }

        return {
            success: true,
            status: 200,
            data: {
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    image: userData.image,
                    batch: userData.batch,
                    departmentId: userData.departmentId,
                    facultyId: userData.facultyId,
                },
                stats: userStats ? {
                    totalPoints: userStats.totalPoints,
                    notesCreated: userStats.notesCreated,
                    rank,
                } : null,
                department: department ?? null,
                faculty: faculty ?? null,
                notes,
            },
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to fetch user profile",
        };
    }
}
