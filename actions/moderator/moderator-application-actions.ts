"use server";

import {db} from "@/db/config";
import {moderatorApplication, user} from "@/db/schema";
import {requireAdmin, requireAuth} from "@/actions/auth/checkAuth";
import {and, desc, eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export async function submitModeratorApplication(motivation?: string) {
    const session = await requireAuth();
    const userId = session.user.id;

    if (session.user.role === "moderator" || session.user.role === "admin") {
        return {
            success: false,
            message: "You are already a moderator or admin",
        };
    }

    const existingApplication = await db
        .select()
        .from(moderatorApplication)
        .where(
            and(
                eq(moderatorApplication.userId, userId),
                eq(moderatorApplication.status, "pending")
            )
        )
        .limit(1);

    if (existingApplication.length > 0) {
        return {
            success: false,
            message: "You already have a pending application",
        };
    }

    await db.insert(moderatorApplication).values({
        userId,
        agreedToRules: true,
        motivation: motivation || null,
    });

    revalidatePath("/become-moderator");

    return {
        success: true,
        message: "Application submitted successfully! We'll review it soon.",
    };
}

export async function getMyApplication() {
    const session = await requireAuth();

    const application = await db
        .select()
        .from(moderatorApplication)
        .where(eq(moderatorApplication.userId, session.user.id))
        .orderBy(desc(moderatorApplication.createdAt))
        .limit(1);

    return application[0] || null;
}

export async function getPendingApplications() {
    await requireAdmin();

    return db
        .select({
            id: moderatorApplication.id,
            userId: moderatorApplication.userId,
            status: moderatorApplication.status,
            motivation: moderatorApplication.motivation,
            createdAt: moderatorApplication.createdAt,
            userName: user.name,
            userEmail: user.email,
            userImage: user.image,
            username: user.username,
        })
        .from(moderatorApplication)
        .innerJoin(user, eq(moderatorApplication.userId, user.id))
        .where(eq(moderatorApplication.status, "pending"))
        .orderBy(desc(moderatorApplication.createdAt));
}

export async function getCurrentModerators() {
    await requireAdmin();

    return db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.role, "moderator"))
        .orderBy(desc(user.createdAt));
}

export async function approveApplication(applicationId: string) {
    const session = await requireAdmin();

    const application = await db
        .select()
        .from(moderatorApplication)
        .where(eq(moderatorApplication.id, applicationId))
        .limit(1);

    if (!application[0]) {
        return { success: false, message: "Application not found" };
    }

    if (application[0].status !== "pending") {
        return { success: false, message: "Application is not pending" };
    }

    await db
        .update(moderatorApplication)
        .set({
            status: "approved",
            reviewedAt: new Date(),
            reviewedBy: session.user.id,
        })
        .where(eq(moderatorApplication.id, applicationId));

    // Update user role to moderator
    await db
        .update(user)
        .set({ role: "moderator" })
        .where(eq(user.id, application[0].userId));

    revalidatePath("/dashboard/admin/moderators");

    return { success: true, message: "Application approved successfully" };
}

export async function rejectApplication(applicationId: string, reason?: string) {
    const session = await requireAdmin();

    const application = await db
        .select()
        .from(moderatorApplication)
        .where(eq(moderatorApplication.id, applicationId))
        .limit(1);

    if (!application[0]) {
        return { success: false, message: "Application not found" };
    }

    if (application[0].status !== "pending") {
        return { success: false, message: "Application is not pending" };
    }

    await db
        .update(moderatorApplication)
        .set({
            status: "rejected",
            reviewedAt: new Date(),
            reviewedBy: session.user.id,
            rejectionReason: reason || null,
        })
        .where(eq(moderatorApplication.id, applicationId));

    revalidatePath("/dashboard/admin/moderators");

    return { success: true, message: "Application rejected" };
}

export async function removeModerator(userId: string) {
    await requireAdmin();

    await db
        .update(user)
        .set({ role: "student" })
        .where(eq(user.id, userId));

    revalidatePath("/dashboard/admin/moderators");

    return { success: true, message: "Moderator removed successfully" };
}
