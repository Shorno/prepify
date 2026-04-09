import "dotenv/config";
import { db } from "@/db/config";
import { badge } from "@/db/schema/streak";

const BADGES = [
    // Upload badges
    { key: "first_upload", name: "First Upload", description: "Upload your first note", icon: "📝", category: "upload", threshold: 1 },
    { key: "notes_5", name: "Rising Star", description: "Upload 5 notes", icon: "⭐", category: "upload", threshold: 5 },
    { key: "notes_10", name: "Prolific Writer", description: "Upload 10 notes", icon: "✍️", category: "upload", threshold: 10 },
    { key: "notes_25", name: "Knowledge Guru", description: "Upload 25 notes", icon: "🧠", category: "upload", threshold: 25 },
    { key: "notes_50", name: "Legend", description: "Upload 50 notes", icon: "🏆", category: "upload", threshold: 50 },

    // Streak badges
    { key: "streak_3", name: "Getting Started", description: "Maintain a 3-day activity streak", icon: "🔥", category: "streak", threshold: 3 },
    { key: "streak_7", name: "Week Warrior", description: "Maintain a 7-day activity streak", icon: "⚡", category: "streak", threshold: 7 },
    { key: "streak_14", name: "Fortnight Fighter", description: "Maintain a 14-day activity streak", icon: "💪", category: "streak", threshold: 14 },
    { key: "streak_30", name: "Monthly Master", description: "Maintain a 30-day activity streak", icon: "🌟", category: "streak", threshold: 30 },

    // Engagement badges (likes received)
    { key: "likes_10", name: "Appreciated", description: "Receive 10 likes on your notes", icon: "👍", category: "engagement", threshold: 10 },
    { key: "likes_50", name: "Popular", description: "Receive 50 likes on your notes", icon: "❤️", category: "engagement", threshold: 50 },
    { key: "likes_100", name: "Century Club", description: "Receive 100 likes on your notes", icon: "❤️‍🔥", category: "engagement", threshold: 100 },

    // Social badges
    { key: "comments_5", name: "Conversationalist", description: "Post 5 comments on notes", icon: "💬", category: "social", threshold: 5 },
    { key: "comments_20", name: "Discussion Leader", description: "Post 20 comments on notes", icon: "🗣️", category: "social", threshold: 20 },
    { key: "followers_5", name: "Influencer", description: "Get 5 followers", icon: "👥", category: "social", threshold: 5 },
];

async function seedBadges() {
    console.log("🌱 Seeding badges...");

    for (const b of BADGES) {
        await db.insert(badge)
            .values(b)
            .onConflictDoNothing();
        console.log(`  ✅ ${b.icon} ${b.name}`);
    }

    console.log(`\n🎉 Done! Seeded ${BADGES.length} badges.`);
    process.exit(0);
}

seedBadges().catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
});
