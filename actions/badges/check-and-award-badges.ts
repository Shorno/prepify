"use server"

import { db } from "@/db/config";
import { badge, userBadge } from "@/db/schema/streak";
import { userStreak } from "@/db/schema/streak";
import { noteLike, noteComment, note } from "@/db/schema/note";
import { follow } from "@/db/schema/follow";
import { notification } from "@/db/schema/notification";
import { eq, and, count } from "drizzle-orm";

type BadgeCheckResult = {
    newBadges: Array<{ key: string; name: string; icon: string }>;
};

export async function checkAndAwardBadges(userId: string): Promise<BadgeCheckResult> {
    try {
        // Get all badges
        const allBadges = await db.query.badge.findMany();

        // Get user's existing badges
        const existingUserBadges = await db.query.userBadge.findMany({
            where: eq(userBadge.userId, userId),
        });
        const earnedBadgeIds = new Set(existingUserBadges.map((ub) => ub.badgeId));

        // Get user stats
        const [userNotes, userLikesReceived, userComments, userFollowers, streakData] = await Promise.all([
            db.query.note.findMany({
                where: eq(note.userId, userId),
            }),
            db.select({ count: count() })
                .from(noteLike)
                .innerJoin(note, eq(noteLike.noteId, note.id))
                .where(eq(note.userId, userId)),
            db.query.noteComment.findMany({
                where: eq(noteComment.userId, userId),
            }),
            db.query.follow.findMany({
                where: eq(follow.followingId, userId),
            }),
            db.query.userStreak.findFirst({
                where: eq(userStreak.userId, userId),
            }),
        ]);

        const stats: Record<string, number> = {
            upload: userNotes.length,
            streak: streakData?.currentStreak ?? 0,
            engagement: Number(userLikesReceived[0]?.count ?? 0),
            social_comments: userComments.length,
            social_followers: userFollowers.length,
        };

        const newBadges: Array<{ key: string; name: string; icon: string }> = [];

        for (const b of allBadges) {
            // Skip if already earned
            if (earnedBadgeIds.has(b.id)) continue;

            let qualifies = false;

            switch (b.category) {
                case "upload":
                    qualifies = stats.upload >= b.threshold;
                    break;
                case "streak":
                    qualifies = stats.streak >= b.threshold;
                    break;
                case "engagement":
                    qualifies = stats.engagement >= b.threshold;
                    break;
                case "social":
                    // Social badges can be for comments or followers
                    if (b.key.startsWith("comments_")) {
                        qualifies = stats.social_comments >= b.threshold;
                    } else if (b.key.startsWith("followers_")) {
                        qualifies = stats.social_followers >= b.threshold;
                    }
                    break;
            }

            if (qualifies) {
                // Award the badge
                await db.insert(userBadge).values({
                    userId,
                    badgeId: b.id,
                }).onConflictDoNothing();

                newBadges.push({ key: b.key, name: b.name, icon: b.icon });

                // Create notification for badge earned
                await db.insert(notification).values({
                    userId,
                    type: "badge_earned",
                    message: `You earned the "${b.name}" badge! ${b.icon}`,
                    actorId: null,
                    noteId: null,
                });
            }
        }

        return { newBadges };
    } catch (error) {
        console.error("Error checking badges:", error);
        return { newBadges: [] };
    }
}
