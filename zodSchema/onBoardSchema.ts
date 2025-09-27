import {z} from "zod";

export const onBoardSchema = z.object({
    role: z.enum(["student", "teacher"], {error: "Please select your role"}),
    department: z.string({error: "Please select your department"}),
    theme: z.enum(["light", "dark", "system"]).default("system").nonoptional(),
})


export type onBoardFormData = z.infer<typeof onBoardSchema>