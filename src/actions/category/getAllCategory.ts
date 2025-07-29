"use server"

import { prisma } from "@/lib/prisma";

export const getAllCategory = async (userId: string) => {
    try {

        const result = await prisma.category.findMany({
            where: {
                userId,
            },
        })

        if(!result) {
            return {
                success: false,
                message: "カテゴリーを取得できませんでした",
                data: null
            }
        }

        return {
            success: true,
            message: "カテゴリーを取得しました",
            data: result
        }

    } catch(error) {
        console.error("カテゴリーの取得に失敗しました:", error);
        return {
            success: false,
            message: "カテゴリーの取得に失敗しました",
            data: null
        };
    }
}