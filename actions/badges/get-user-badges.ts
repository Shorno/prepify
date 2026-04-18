"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { badge, userBadge, UserBadgeWithBadge, Badge } from "@/db/schema/streak";
import { eq } from "drizzle-orm";

export type UserBadgesResult = {
    earned: UserBadgeWithBadge[];
    all: Badge[];
};

export async function getUserBadges(userId: string): Promise<ActionResult<UserBadgesResult>> {
    try {
        const [earned, allBadges] = await Promise.all([
            db.query.userBadge.findMany({
                where: eq(userBadge.userId, userId),
                with: {
                    badge: true,
                },
                orderBy: (ub, { desc }) => [desc(ub.earnedAt)],
            }),
            db.query.badge.findMany({
                orderBy: (b, { asc }) => [asc(b.category), asc(b.threshold)],
            }),
        ]);

        return {
            status: 200,
            success: true,
            data: {
                earned: earned as UserBadgeWithBadge[],
                all: allBadges,
            },
        };
    } catch (error) {
        console.error("Error getting user badges:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to get badges",
        };
    }
}
