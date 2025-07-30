// import { Checklist } from "@/types/todo";
import { Category, CheckListItem, Todo } from "@prisma/client";
import {atom} from "jotai";

export type TodoCompleteType = Todo & {
    category?: Category | null;
    checkList: CheckListItem[];
} 

export const todosAtom = atom<TodoCompleteType[]>([])

export const filteredTodosAtom = atom<TodoCompleteType[]>([])
export const todoFilterAtom = atom<"all" | "incomplete" | "completed">("all")

export const searchTodoTerm = atom<string>("")