import {z} from "zod"

export const todoSchema = z.object({
    title: z.string().min(1,{message: "タスク名は必須です"}),
    completed: z.boolean()
})

export type TodoSchema = z.infer<typeof todoSchema>