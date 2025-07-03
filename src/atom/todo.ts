import { Todo } from "@prisma/client";
import {atom} from "jotai";

export const todosAtom = atom<Todo[]>([])

export const filteredTodosAtom = atom<Todo[]>([])
export const todoFilterAtom = atom<"all" | "incomplete" | "completed">("all")