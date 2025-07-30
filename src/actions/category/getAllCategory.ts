"use server"

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { checkAuth } from "@/utils/auth";
import { Category } from "@prisma/client";

export const getAllCategory = async (): Promise<ApiResponse<Category[]>> => {
    try {

        const authResult = await checkAuth();
        if(!authResult.success) {
            return {
                success: false,
                message: authResult.message,
                data: null
            }
        }

        const result = await prisma.category.findMany({
            where: {
                userId: authResult.data!.id,
            },
        })

        if(!result) {
            return {
                success: false,
                message: "カテゴリーを取得できませんでした",
                data: []
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
            data: []
        };
    }
}