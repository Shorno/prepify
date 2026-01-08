"use server";

import { db } from "@/db/config";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { userSettingsSchema, UserSettingsFormData } from "@/zodSchema/userSettingsSchema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface UpdateSettingsResponse {
    success: boolean;
    message: string;
    error?: string;
}

export async function updateUserSettings(
    data: UserSettingsFormData
): Promise<UpdateSettingsResponse> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                success: false,
                message: "Unauthorized",
                error: "You must be logged in to update settings",
            };
        }

        // Validate the data
        const result = userSettingsSchema.safeParse(data);
        if (!result.success) {
            return {
                success: false,
                message: "Validation failed",
                error: result.error.issues[0]?.message || "Invalid data",
            };
        }

        // Check if username is already taken (by another user)
        const existingUser = await db.query.user.findFirst({
            where: eq(user.username, result.data.username),
        });

        if (existingUser && existingUser.id !== session.user.id) {
            return {
                success: false,
                message: "Username taken",
                error: "This username is already in use",
            };
        }

        // Update user settings
        await db
            .update(user)
            .set({
                username: result.data.username,
                departmentId: result.data.departmentId,
                facultyId: result.data.facultyId,
                batch: result.data.batch || null,
            })
            .where(eq(user.id, session.user.id));

        // Refresh session to get updated user data
        await auth.api.getSession({
            query: {
                disableCookieCache: true,
            },
            headers: await headers(),
        });

        return {
            success: true,
            message: "Settings updated successfully",
        };
    } catch (error) {
        console.error("Error updating user settings:", error);
        return {
            success: false,
            message: "Failed to update settings",
            error: "An unexpected error occurred",
        };
    }
}

export async function getCurrentUserSettings() {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        const currentUser = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
        });

        if (!currentUser) {
            return { success: false, error: "User not found" };
        }

        return {
            success: true,
            data: {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                image: currentUser.image,
                username: currentUser.username || "",
                role: currentUser.role as "student" | "teacher",
                departmentId: currentUser.departmentId || "",
                facultyId: currentUser.facultyId || "",
                batch: currentUser.batch || "",
            },
        };
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return { success: false, error: "Failed to fetch settings" };
    }
}
