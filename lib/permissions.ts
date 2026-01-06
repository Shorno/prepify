import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Custom permissions for your app
 * Use `as const` so TypeScript can infer the type correctly
 */
const statement = {
    ...defaultStatements,
    // Add custom resource permissions as needed
    notes: ["create", "read", "update", "delete", "moderate"],
    content: ["create", "read", "update", "delete", "approve", "reject"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Student role - default role, basic permissions
 */
export const student = ac.newRole({
    notes: ["create", "read", "update", "delete"],
});

/**
 * Teacher role - can create and manage their own content
 */
export const teacher = ac.newRole({
    notes: ["create", "read", "update", "delete"],
    content: ["create", "read", "update"],
});

/**
 * Moderator role - can moderate content but limited user management
 */
export const moderator = ac.newRole({
    notes: ["create", "read", "update", "delete", "moderate"],
    content: ["create", "read", "update", "delete", "approve", "reject"],
    user: ["list"],
});

/**
 * Admin role - full admin permissions plus custom permissions
 */
export const admin = ac.newRole({
    ...adminAc.statements,
    notes: ["create", "read", "update", "delete", "moderate"],
    content: ["create", "read", "update", "delete", "approve", "reject"],
});
