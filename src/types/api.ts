import { Prisma } from "@prisma/client";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface AuthResponse {
    success: boolean;
    message: string;
}

export type TodoWithIncludes = Prisma.TodoGetPayload<{
    include: {
        category: true;
        user: true;
        checkList: {
            orderBy: {
                order: "asc";
            };
        };
    }
}>