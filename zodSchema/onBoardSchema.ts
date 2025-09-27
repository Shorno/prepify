import {z} from "zod";

export const onBoardSchema = z.object({
    role: z.enum(["student", "teacher"], {error: "Please select your role"}),
    department: z.string().optional(),
    theme: z.enum(["light", "dark", "system"]).default("system").nonoptional(),
}).refine((data) => {
    return !(data.role === "student" && !data.department);
}, {
    message: "Please select your department",
    path: ["department"],
});


export type onBoardFormData = z.infer<typeof onBoardSchema>