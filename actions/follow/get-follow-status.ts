"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { follow } from "@/db/schema/follow";
import { eq, and, count } from "drizzle-orm";

type FollowStatus = {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
};

export default async function getFollowStatus(userId: string): Promise<ActionResult<FollowStatus>> {
    const session = await checkAuth();

    try {
        // Get followers count
        const [followersResult] = await db
            .select({ count: count() })
            .from(follow)
            .where(eq(follow.followingId, userId));

        // Get following count
        const [followingResult] = await db
            .select({ count: count() })
            .from(follow)
            .where(eq(follow.followerId, userId));

        // Check if current user is following this user
        let isFollowing = false;
        if (session?.user && session.user.id !== userId) {
            const existingFollow = await db.query.follow.findFirst({
                where: and(
                    eq(follow.followerId, session.user.id),
                    eq(follow.followingId, userId)
                ),
            });
            isFollowing = !!existingFollow;
        }

        return {
            success: true,
            status: 200,
            data: {
                isFollowing,
                followersCount: followersResult?.count ?? 0,
                followingCount: followingResult?.count ?? 0,
            },
        };
    } catch (error) {
        console.error("Error getting follow status:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to get follow status",
        };
    }
}
