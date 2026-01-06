import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";
import { ac, admin, moderator, student, teacher } from "@/lib/permissions";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        adminClient({
            ac,
            roles: {
                admin,
                moderator,
                student,
                teacher
            }
        })
    ]
})






