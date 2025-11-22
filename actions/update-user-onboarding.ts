"use server"
import {onBoardFormData, onBoardSchema} from "@/zodSchema/onBoardSchema";
import {checkAuth} from "@/app/actions/user/checkAuth";
import {db} from "@/db/config";
import {user} from "@/db/schema";
import {eq} from "drizzle-orm";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";


interface OnBoardingResponse {
    success: boolean
    status: number,
    message: string,
}

export default async function updateUserOnboarding(data: onBoardFormData): Promise<OnBoardingResponse> {
    const session = await checkAuth();

    try {
        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401
            }
        }
        const result = onBoardSchema.safeParse(data)
        if (!result.success) {
            return {
                success: false,
                message: "Invalid form data",
                status: 400
            }
        }

        await db
            .update(user)
            .set({
                role: result.data.role.toUpperCase(),
                departmentId: result.data.departmentId,
                facultyId: result.data.facultyId,
                batch: result.data.role === "student" ? result.data.batch || null : null,
                username: result.data.username,
                hasCompletedOnboarding: true
            })
            .where(eq(user.id, session.user.id));

        await auth.api.getSession({
            query: {
                disableCookieCache: true
            },
            headers: await headers()
        })

        return {
            success: true,
            message: "Onboarding completed successfully",
            status: 200
        }

    } catch {
        return {
            success: false,
            message: "Internal server error",
            status: 500
        }
    }

}