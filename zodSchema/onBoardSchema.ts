import {z} from "zod";

export const onBoardSchema = z.object({
    role: z.enum(["student", "teacher"], {error: "Please select your role"}),
    departmentId: z.string({error: "Please select your department"}),
    batch: z.string().optional(),
    theme: z.enum(["light", "dark", "system"]).default("system").nonoptional(),
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