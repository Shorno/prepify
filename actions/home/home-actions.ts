"use server";

import { note, department, user} from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/db/config";

export const getFeaturedNotes = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const notes = await db.query.note.findMany({
                    where: eq(note.status, "approved"),
                    orderBy: [desc(note.viewsCount), desc(note.createdAt)],
                    limit: 8,
                    with: {
                        user: true,
                        course: true,
                        department: true,
                        faculty: true,
                        resources: true,
                        files: true,
                        likes: true,
                        comments: {
                            with: {
                                user: true
                            }
                        }
                    }
                });
                return { success: true, data: notes };
            } catch (error) {
                console.error("Error fetching featured notes:", error);
                return { success: false, error: "Failed to fetch featured notes" };
            }
        },
        ["featured-notes"],
        { revalidate: 3600 } // Cache for 1 hour
    )();
});

export const getPlatformStats = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const [notesCount] = await db.select({ count: count() }).from(note);
                const [usersCount] = await db.select({ count: count() }).from(user);
                const [viewsResult] = await db.select({ totalViews: sql<number>`sum(${note.viewsCount})` }).from(note);
                const [departmentsCount] = await db.select({ count: count() }).from(department);

                return {
                    success: true,
                    data: {
                        notesCount: notesCount.count,
                        usersCount: usersCount.count,
                        totalViews: viewsResult?.totalViews || 0,
                        departmentsCount: departmentsCount.count
                    }
                };
            } catch (error) {
                console.error("Error fetching platform stats:", error);
                return {
                    success: false,
                    data: {
                        notesCount: 0,
                        usersCount: 0,
                        totalViews: 0,
                        departmentsCount: 0
                    }
                };
            }
        },
        ["platform-stats"],
        { revalidate: 3600 }
    )();
});

export const getDepartmentsWithCounts = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                // This is a simplified version. For exact counts per department we'd need a join and group by.
                // For now, let's just get the departments and we can get counts separately or approximate.
                // Or better, let's do a join.

                const departments = await db.select({
                    id: department.id,
                    name: department.name,
                    code: department.departmentCode,
                    noteCount: count(note.id)
                })
                    .from(department)
                    .leftJoin(note, eq(note.departmentId, department.id))
                    .groupBy(department.id)
                    .orderBy(desc(count(note.id)))
                    .limit(8);

                return { success: true, data: departments };
            } catch (error) {
                console.error("Error fetching departments:", error);
                return { success: false, error: "Failed to fetch departments" };
            }
        },
        ["home-departments"],
        { revalidate: 3600 }
    )();
});
