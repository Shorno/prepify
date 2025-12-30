"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { follow } from "@/db/schema/follow";
import { user } from "@/db/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function unfollowUser(userId: string): Promise<ActionResult<{ unfollowed: boolean }>> {
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
            error: "You cannot unfollow yourself",
        };
    }

    try {
        // Check if following
        const existingFollow = await db.query.follow.findFirst({
            where: and(
                eq(follow.followerId, session.user.id),
                eq(follow.followingId, userId)
            ),
        });

        if (!existingFollow) {
            return {
                success: false,
                status: 400,
                error: "You are not following this user",
            };
        }

        // Get target user for revalidation
        const targetUser = await db.query.user.findFirst({
            where: eq(user.id, userId),
        });

        // Delete follow relationship
        await db.delete(follow).where(
            and(
                eq(follow.followerId, session.user.id),
                eq(follow.followingId, userId)
            )
        );

        if (targetUser?.username) {
            revalidatePath(`/user/${targetUser.username}`);
        }

        return {
            success: true,
            status: 200,
            data: { unfollowed: true },
            message: "Successfully unfollowed user",
        };
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to unfollow user",
        };
    }
}
