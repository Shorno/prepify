"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { notification } from "@/db/schema/notification";
import { user } from "@/db/schema/auth-schema";
import { note } from "@/db/schema/note";
import { eq, desc, count, and } from "drizzle-orm";
import { NotificationWithRelations } from "@/db/schema/notification";

type GetNotificationsResult = {
    notifications: NotificationWithRelations[];
    unreadCount: number;
    totalCount: number;
};

export default async function getNotifications(
    limit: number = 20,
    offset: number = 0
): Promise<ActionResult<GetNotificationsResult>> {
    const session = await checkAuth();

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    try {
        // Get notifications with actor and note info
        const notifications = await db
            .select({
                id: notification.id,
                userId: notification.userId,
                type: notification.type,
                message: notification.message,
                actorId: notification.actorId,
                noteId: notification.noteId,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                actorName: user.name,
                actorImage: user.image,
                noteTitle: note.title,
            })
            .from(notification)
            .leftJoin(user, eq(notification.actorId, user.id))
            .leftJoin(note, eq(notification.noteId, note.id))
            .where(eq(notification.userId, session.user.id))
            .orderBy(desc(notification.createdAt))
            .limit(limit)
            .offset(offset);

        // Get unread count
        const [unreadResult] = await db
            .select({ count: count() })
            .from(notification)
            .where(
                and(
                    eq(notification.userId, session.user.id),
                    eq(notification.isRead, false)
                )
            );

        // Get total count
        const [totalResult] = await db
            .select({ count: count() })
            .from(notification)
            .where(eq(notification.userId, session.user.id));

        // Transform to expected format
        const transformedNotifications: NotificationWithRelations[] = notifications.map((n) => ({
            id: n.id,
            userId: n.userId,
            type: n.type,
            message: n.message,
            actorId: n.actorId,
            noteId: n.noteId,
            isRead: n.isRead,
            createdAt: n.createdAt,
            actor: n.actorId ? {
                id: n.actorId,
                name: n.actorName!,
                image: n.actorImage,
            } : null,
            note: n.noteId ? {
                id: n.noteId,
                title: n.noteTitle!,
            } : null,
        }));

        return {
            success: true,
            status: 200,
            data: {
                notifications: transformedNotifications,
                unreadCount: unreadResult?.count ?? 0,
                totalCount: totalResult?.count ?? 0,
            },
        };
    } catch (error) {
        console.error("Error getting notifications:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to get notifications",
        };
    }
}
