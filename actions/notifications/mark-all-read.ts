"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { notification } from "@/db/schema/notification";
import { eq } from "drizzle-orm";

export default async function markAllNotificationsRead(): Promise<ActionResult<{ count: number }>> {
    const session = await checkAuth();

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    try {
        // Mark all user's notifications as read
        const result = await db
            .update(notification)
            .set({ isRead: true })
            .where(eq(notification.userId, session.user.id));

        return {
            success: true,
            status: 200,
            data: { count: 0 }, // Drizzle doesn't return count easily
            message: "All notifications marked as read",
        };
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to mark notifications as read",
        };
    }
}
