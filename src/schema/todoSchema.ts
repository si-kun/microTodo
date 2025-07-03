import {z} from "zod"

export const todoSchema = z.object({
    title: z.string().min(1,{message: "タスク名は必須です"}),
    completed: z.boolean(),
    hasDeadline: z.boolean(),
    startDate: z.date().optional(),
    dueDate: z.date().optional(),
})
export const createTodoSchema = z.object({
    title: z.string().min(1,{message: "タスク名は必須です"}),
    completed: z.boolean(),
    hasDeadline: z.boolean(),
    startDate: z.date().optional().transform(val => val ?? undefined),
    dueDate: z.date().optional().transform(val => val ?? undefined),
})

export type TodoSchema = z.infer<typeof todoSchema>
export type CreateTodoSchema = z.infer<typeof createTodoSchema>