"use server"

import {db} from "@/db/config";
import {ActionResult} from "@/types/action-response";
import {LeaderboardEntry} from "@/db/schema";

export type LeaderboardWithUserHighlight = {
    topUsers: LeaderboardEntry[];
    currentUser: LeaderboardEntry | null;
    isInTopList: boolean;
};

export async function getLeaderboardWithUserHighlight(
    userId: string,
    limit: number = 10
): Promise<ActionResult<LeaderboardWithUserHighlight>> {

    try {
        const allUsers = await db.query.userPoints.findMany({
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

        // Add ranks
        const rankedUsers = allUsers.map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        // Get top N users
        const topUsers = rankedUsers.slice(0, limit);

        // Find current user
        const currentUser = rankedUsers.find(entry => entry.userId === userId) || null;
        const isInTopList = currentUser ? currentUser.rank <= limit : false;

        return {
            success: true,
            status: 200,
            data: {
                topUsers,
                currentUser,
                isInTopList,
            },
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
