"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { userStreak } from "@/db/schema/streak";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq } from "drizzle-orm";
import { UserStreak } from "@/db/schema/streak";

export async function getStreak(userId?: string): Promise<ActionResult<UserStreak | null>> {
    try {
        const targetUserId = userId || (await checkAuth())?.user?.id;

        if (!targetUserId) {
            return {
                status: 200,
                success: true,
                data: null,
            };
        }

        const streak = await db.query.userStreak.findFirst({
            where: eq(userStreak.userId, targetUserId),
        });

        return {
            status: 200,
            success: true,
            data: streak || null,
        };
    } catch (error) {
        console.error("Error getting streak:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to get streak data",
        };
    }
}
