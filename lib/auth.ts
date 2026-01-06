import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/config";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, moderator, student, teacher } from "@/lib/permissions";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    user: {
        additionalFields: {
            departmentId: {
                type: "number",
                required: true,
                input: true
            },
            facultyId: {
                type: "number",
                required: true,
                input: true
            },
            batch: {
                type: "string",
                required: false,
                input: true,
            },
            username: {
                type: "string",
                required: true,
                input: true,
            },
            hasCompletedOnboarding: {
                type: "boolean",
                required: true,
                defaultValue: false,
                input: false
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },

    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },

    plugins: [
        nextCookies(),
        adminPlugin({
            defaultRole: "student",
            ac,
            roles: {
                admin,
                moderator,
                student,
                teacher
            }
        })
    ]
});


