"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";
import { ApiResponse, TodoWithIncludes } from "@/types/api";
import { checkAuth } from "@/utils/auth";

export const updateTodo = async (todoId: string, data: CreateTodoSchema) : Promise<ApiResponse<TodoWithIncludes>> => {
  try {

    const authResult = await checkAuth();
    if (!authResult.success) {
      return {
        success: false,
        message: authResult.message,
        data: null,
      };
    }

    const userId = authResult.data!.id

    if (!data.startDate && !data.dueDate) {
      data.hasDeadline = true;
    }

    if (data.hasDeadline) {
      data.dueDate = undefined;
      data.startDate = undefined;
    }

    const category = await prisma.category.upsert({
      where: {
        userId_name: {
          userId,
          name: data.category,
        },
      },
      update: {},
      create: {
        name: data.category || "未分類",
        userId,
        color: data.categoryColor || "#f0f0f0",
      },
    });

    const result = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title: data.title,
        completed: data.completed,
        hasDeadline: data.hasDeadline,
        startDate: data.startDate,
        dueDate: data.dueDate,
        categoryId: category.id,
        isPriority: data.priority,
      },
      include: {
        category: true,
        user: true,
        checkList: true,
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
