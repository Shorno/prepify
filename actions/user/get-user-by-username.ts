"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { user } from "@/db/schema/auth-schema";
import { note } from "@/db/schema/note";
import { eq } from "drizzle-orm";
import { User } from "@/db/schema/auth-schema";

type UserProfile = {
    user: Pick<User, "id" | "name" | "image" | "batch" | "username"> & {
        department?: string | null;
        faculty?: string | null;
    };
    notesCount: number;
};

export default async function getUserByUsername(username: string): Promise<ActionResult<UserProfile>> {
    if (!username) {
        return {
            success: false,
            status: 400,
            error: "Username is required",
        };
    }

    try {
        const foundUser = await db.query.user.findFirst({
            where: eq(user.username, username),
        });

        if (!foundUser) {
            return {
                success: false,
                status: 404,
                error: "User not found",
            };
        }

        // Get notes count
        const userNotes = await db.query.note.findMany({
            where: eq(note.userId, foundUser.id),
        });

        return {
            success: true,
            status: 200,
            data: {
                user: {
                    id: foundUser.id,
                    name: foundUser.name,
                    image: foundUser.image,
                    batch: foundUser.batch,
                    username: foundUser.username,
                    department: foundUser.departmentId,
                    faculty: foundUser.facultyId,
                },
                notesCount: userNotes.length,
            },
        };
    } catch (error) {
        console.error("Error getting user by username:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to get user",
        };
    }
}
