// import { Checklist } from "@/types/todo";
import { Category, CheckListItem, Todo } from "@prisma/client";
import {atom} from "jotai";

export type TodoWithCategoryChecklist = Todo & {
    category?: Category | null;
    checkLists: CheckListItem[];
} 

export const todosAtom = atom<TodoWithCategoryChecklist[]>([])

export const filteredTodosAtom = atom<TodoWithCategoryChecklist[]>([])
export const todoFilterAtom = atom<"all" | "incomplete" | "completed">("all")

export const searchTodoTerm = atom<string>("")