"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { Todo } from "@prisma/client";

export const toggleTodo = async (id: string): Promise<ApiResponse<Todo>> => {
  try {
    const currentTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!currentTodo) {
      return {
        success: false,
        message: "Todoが見つかりません",
        data: null,
      };
    }

    const result = await prisma.todo.update({
      where: { id },
      data: {
        completed: !currentTodo.completed,
      },
      include: {
        category: true,
        user: true,
      },
    });

    return {
      success: true,
      message: currentTodo.completed
        ? "Todoを未完了にしました"
        : "Todoを完了しました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Todoの完了に失敗しました",
      data: null,
    };
  }
};
