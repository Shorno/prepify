"use server"

import {db} from "@/db/config";
import {ActionResult} from "@/types/action-response";
import {LeaderboardEntry} from "@/db/schema";

export async function getPublicLeaderboard(limit: number = 50): Promise<ActionResult<LeaderboardEntry[]>> {
    try {
        const results = await db.query.userPoints.findMany({
            limit,
            orderBy: (userPoints, {desc}) => [desc(userPoints.totalPoints)],
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        const leaderboard = results.map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return {
            success: true,
            status: 200,
            data: leaderboard,
        };
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to fetch leaderboard",
        };
    }
}
