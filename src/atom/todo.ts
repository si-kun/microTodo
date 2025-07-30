// import { Checklist } from "@/types/todo";
import { TodoWithIncludes } from "@/types/api";
import {atom} from "jotai";

export const todosAtom = atom<TodoWithIncludes[]>([])

export const filteredTodosAtom = atom<TodoWithIncludes[]>([])
export const todoFilterAtom = atom<"all" | "incomplete" | "completed">("all")

export const searchTodoTerm = atom<string>("")