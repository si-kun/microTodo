"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";

export const updateTodo = async (todoId: string,data: CreateTodoSchema) => {
  try {
    const result = await prisma.todo.update({
      where: { id:todoId },
      data: {
        title: data.title,
        completed: data.completed,
        hasDeadline: data.hasDeadline,
        startDate: data.startDate,
        dueDate: data.dueDate,
        category: data.category,
      },
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
