import {z} from "zod";

export const noteSchema = z.object({
    departmentId: z.string({message : "Department is required"}),
    facultyId: z.string({message : "Faculty is required"}),
    title: z.string().min(1, "Title is required"),
    description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
    files: z
        .array(z.url("Please enter a valid image URL."))
        .max(10, "You can upload a maximum of 10 files.")
        .default([]).nonoptional(),
    courseId: z.string({message : "Course is required"}),
    resources: z.array(z.object({
        url: z.url("Please enter a valid URL")
    })).default([]).optional()

})

export type NoteFormData = z.infer<typeof noteSchema>