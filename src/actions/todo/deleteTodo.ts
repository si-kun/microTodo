"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { Todo } from "@prisma/client";

export const deleteTodo = async (id: string) : Promise<ApiResponse<Todo>> => {
  try {

    const result = await prisma.todo.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Todoを削除しました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Todoの削除に失敗しました",
      data: null,
    };
  }
};
