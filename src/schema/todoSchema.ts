import {z} from "zod"

export const createTodoSchema = z.object({
    title: z.string().min(1,{message: "タスク名は必須です"}),
    completed: z.boolean(),
    hasDeadline: z.boolean(),
    startDate: z.date().optional().transform(val => val ?? undefined),
    dueDate: z.date().optional().transform(val => val ?? undefined),
    category: z.string(),
    categoryColor: z.string().optional(),
    priority: z.enum(["low", "normal", "high"]).default("low"),
})

export type CreateTodoSchema = z.infer<typeof createTodoSchema>