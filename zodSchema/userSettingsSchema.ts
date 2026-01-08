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
    role: z.enum(["student", "teacher"]),
}).refine(
    (data) => {
        if (data.role === "student") {
            return !!data.batch && data.batch.length > 0;
        }
        return true;
    },
    {
        message: "Please select your batch",
        path: ["batch"],
    }
);

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
