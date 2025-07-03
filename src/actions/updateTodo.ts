"use server";

import { prisma } from "@/lib/prisma";

export const updateTodo = async (id: string, title: string) => {
  try {
    const result = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return {
      success: true,
      message: "Todoを更新しました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Todoの更新に失敗しました",
      data: null,
    };
  }
};
