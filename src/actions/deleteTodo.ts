"use server";

import { prisma } from "@/lib/prisma";

export const deleteTodo = async (id: string) => {
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
