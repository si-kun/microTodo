import { PRIORITY_OPTIONS } from "@/constants/priority"
import { z} from "zod"

const priorityValues = PRIORITY_OPTIONS.map(option => option.value) as [string, ...string[]]

export const createTodoSchema = z.object({
    title: z.string().min(1,{message: "タスク名は必須です"}),
    completed: z.boolean(),
    hasDeadline: z.boolean(),
    startDate: z.date().optional(),
    dueDate: z.date().optional(),
    category: z.string().min(1),
    categoryColor: z.string(),
    priority: z.enum(priorityValues),
    checkList: z.array(
        z.object({
            title: z.string(),
            completed: z.boolean(),
            order: z.number()
        })
    ),
})

export type CreateTodoSchema = z.infer<typeof createTodoSchema>