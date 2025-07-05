"use server"

import { prisma } from "@/lib/prisma"
import { getUser } from "./user/getUser"

export const getAllTodos = async() => {

    try {

        const userResult = await getUser();

        if(!userResult.success || !userResult.user) {
            return {
                success: false,
                message: userResult.message || "ユーザー情報の取得に失敗しました",
            }
        }

        const result = await prisma.todo.findMany({
            where: {
                userId: userResult.user.id
            },
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