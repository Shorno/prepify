import { z } from "zod";

export const userSettingsSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(20, { message: "Username must be at most 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores",
        }),
    departmentId: z.string().min(1, { message: "Please select your department" }),
    facultyId: z.string().min(1, { message: "Faculty is required" }),
    batch: z.string().optional(),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
