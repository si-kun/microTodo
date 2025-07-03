"use server"

import { prisma } from "@/lib/prisma"

export const getAllTodos = async() => {

    try {

        const result = await prisma.todo.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        if(!result) {
            return {
                success: false,
                message: "Todoの取得に失敗しました"
            }
        }

        return {
            success: true,
            message: "Todoの取得に成功しました",
            data: result,
        }

    } catch(error) {
        console.error("Failed to fetch todos:", error)
        return {
            success: false,
            error: "Failed to fetch todos",
            message: "Todoの取得に失敗しました"
        }
    }
}