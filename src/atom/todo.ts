import { Todo } from "@prisma/client";
import {atom} from "jotai";

export const todosAtom = atom<Todo[]>([])