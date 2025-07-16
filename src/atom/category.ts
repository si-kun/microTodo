import { Category } from "@prisma/client";
import { atom } from "jotai";

export const categoryAtom = atom<Category[]>([]);