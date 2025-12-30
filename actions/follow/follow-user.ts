"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { follow } from "@/db/schema/follow";
import { notification } from "@/db/schema/notification";
import { user } from "@/db/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function followUser(userId: string): Promise<ActionResult<{ followed: boolean }>> {
    const session = await checkAuth();

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    if (session.user.id === userId) {
        return {
            success: false,
            status: 400,
            error: "You cannot follow yourself",
        };
    }

    try {
        // Check if already following
        const existingFollow = await db.query.follow.findFirst({
            where: and(
                eq(follow.followerId, session.user.id),
                eq(follow.followingId, userId)
            ),
        });

        if (existingFollow) {
            return {
                success: false,
                status: 400,
                error: "Already following this user",
            };
        }

        // Check if target user exists
        const targetUser = await db.query.user.findFirst({
            where: eq(user.id, userId),
        });

        if (!targetUser) {
            return {
                success: false,
                status: 404,
                error: "User not found",
            };
        }

        // Create follow relationship and notification in transaction
        await db.transaction(async (tx) => {
            // Create follow
            await tx.insert(follow).values({
                followerId: session.user.id,
                followingId: userId,
            });

            // Create notification for the followed user
            await tx.insert(notification).values({
                userId: userId,
                type: "new_follower",
                message: `${session.user.name} started following you`,
                actorId: session.user.id,
            });
        });

        revalidatePath(`/user/${targetUser.username}`);

        return {
            success: true,
            status: 201,
            data: { followed: true },
            message: `You are now following ${targetUser.name}`,
        };
    } catch (error) {
        console.error("Error following user:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to follow user",
        };
    }
}
