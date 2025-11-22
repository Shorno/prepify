import {z} from "zod";

export const onBoardSchema = z.object({
    role: z.enum(["student", "teacher"], {error: "Please select your role"}),
    departmentId: z.string({error: "Please select your department"}),
    facultyId: z.string({error: "Faculty ID is required"}),
    batch: z.string(),
    theme: z.enum(["light", "dark", "system"]).default("system").nonoptional(),
    username: z.string().min(3, {message: "Username must be at least 3 characters"}).max(20, {message: "Username must be at most 20 characters"})
}).refine((data) => {
    if (data.role === "student") {
        return !!data.batch && data.batch.length > 0;
    }
    return true;
}, {
    message: "Please select your batch",
    path: ["batch"]
})


export type onBoardFormData = z.infer<typeof onBoardSchema>