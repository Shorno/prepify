"use server"

import { db } from "@/db/config";
import { notification } from "@/db/schema/notification";

type CreateNotificationParams = {
    userId: string;
    type: string;
    message: string;
    actorId?: string;
    noteId?: number;
};

/**
 * Internal helper to create notifications.
 * This is not exposed directly to clients.
 */
export async function createNotification(params: CreateNotificationParams): Promise<void> {
    try {
        await db.insert(notification).values({
            userId: params.userId,
            type: params.type,
            message: params.message,
            actorId: params.actorId,
            noteId: params.noteId,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        // Don't throw - notifications are not critical
    }
}

/**
 * Create notifications for multiple users at once (e.g., all followers)
 */
export async function createBulkNotifications(
    userIds: string[],
    data: Omit<CreateNotificationParams, "userId">
): Promise<void> {
    if (userIds.length === 0) return;

    try {
        const values = userIds.map((userId) => ({
            userId,
            type: data.type,
            message: data.message,
            actorId: data.actorId,
            noteId: data.noteId,
        }));

        await db.insert(notification).values(values);
    } catch (error) {
        console.error("Error creating bulk notifications:", error);
        // Don't throw - notifications are not critical
    }
}
