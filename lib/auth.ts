import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db/config";
import {nextCookies} from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "STUDENT",
                input: true
            },
            department: {
                type: "string",
                required: true,
                defaultValue: "cse",
                input: true
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
    },

    plugins : [nextCookies()]
});


