"use server"

import { db } from "@/db/config";
import { userStreak } from "@/db/schema/streak";
import { eq } from "drizzle-orm";

function getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getYesterdayDateString(): string {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toISOString().split("T")[0];
}

export async function updateStreak(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    isNewDay: boolean;
}> {
    try {
        const today = getTodayDateString();

        const existing = await db.query.userStreak.findFirst({
            where: eq(userStreak.userId, userId),
        });

        if (!existing) {
            // First activity ever
            await db.insert(userStreak).values({
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActiveDate: today,
            });

            return { currentStreak: 1, longestStreak: 1, isNewDay: true };
        }

        // Same day — no streak change
        if (existing.lastActiveDate === today) {
            return {
                currentStreak: existing.currentStreak,
                longestStreak: existing.longestStreak,
                isNewDay: false,
            };
        }

        const yesterday = getYesterdayDateString();
        let newCurrentStreak: number;

        if (existing.lastActiveDate === yesterday) {
            // Consecutive day — increment streak
            newCurrentStreak = existing.currentStreak + 1;
        } else {
            // Streak broken — reset to 1
            newCurrentStreak = 1;
        }

        const newLongestStreak = Math.max(existing.longestStreak, newCurrentStreak);

        await db.update(userStreak)
            .set({
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak,
                lastActiveDate: today,
                updatedAt: new Date(),
            })
            .where(eq(userStreak.userId, userId));

        return {
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            isNewDay: true,
        };
    } catch (error) {
        console.error("Error updating streak:", error);
        return { currentStreak: 0, longestStreak: 0, isNewDay: false };
    }
}
