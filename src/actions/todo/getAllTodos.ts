"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse, TodoWithIncludes } from "@/types/api";
import { checkAuth } from "@/utils/auth";

export const getAllTodos = async (): Promise<ApiResponse<TodoWithIncludes[]>> => {
  try {
    const authResult = await checkAuth();

    if (!authResult.success) {
      return {
        success: false,
        message: "認証に失敗しました",
        data: null,
      };
    }

    const result = await prisma.todo.findMany({
      where: {
        userId: authResult.data!.id,
      },
      include: {
        category: true,
        user: true,
        checkList: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Todoの取得に失敗しました",
        data: [],
      };
    }

    return {
      success: true,
      message: "Todoの取得に成功しました",
      data: result,
    };

  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return {
      success: false,
      message: "Todoの取得に失敗しました",
      data: [],
    };
  }
};
