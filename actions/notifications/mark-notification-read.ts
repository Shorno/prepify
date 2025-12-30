"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { notification } from "@/db/schema/notification";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function markNotificationRead(
    notificationId: number
): Promise<ActionResult<{ marked: boolean }>> {
    const session = await checkAuth();

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    try {
        // Verify the notification belongs to this user
        const existingNotification = await db.query.notification.findFirst({
            where: and(
                eq(notification.id, notificationId),
                eq(notification.userId, session.user.id)
            ),
        });

        if (!existingNotification) {
            return {
                success: false,
                status: 404,
                error: "Notification not found",
            };
        }

        // Mark as read
        await db
            .update(notification)
            .set({ isRead: true })
            .where(eq(notification.id, notificationId));

        return {
            success: true,
            status: 200,
            data: { marked: true },
        };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to mark notification as read",
        };
    }
}
