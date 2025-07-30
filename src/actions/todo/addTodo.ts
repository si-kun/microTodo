"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";
import { ApiResponse, TodoWithIncludes } from "@/types/api";
import { checkAuth } from "@/utils/auth";

export const addTodo = async (data: CreateTodoSchema) : Promise<ApiResponse<TodoWithIncludes>> => {
  try {
    const authResult = await checkAuth()

    if(!authResult.success) {
      return {
        success: false,
        message: "認証に失敗しました",
        data: null,
      }
    }

    const userId = authResult.data!.id

    if (!data.startDate && !data.dueDate) {
      data.hasDeadline = false;
    }

    if (!data.hasDeadline) {
      data.dueDate = undefined;
      data.startDate = undefined;
    }

    const categoryName =
      data.category && data.category.trim() !== "" ? data.category : "未分類";

    const category = await prisma.category.upsert({
      where: {
        userId_name: {
          userId,
          name: categoryName,
        },
      },
      update: {
        color: data.categoryColor || "#f0f0f0",
      },
      create: {
        name: categoryName,
        userId,
        color: data.categoryColor || "#f0f0f0",
      },
    });

    const result = await prisma.todo.create({
      data: {
        title: data.title,
        completed: data.completed,
        hasDeadline: data.hasDeadline,
        startDate: data.startDate,
        dueDate: data.dueDate,
        isPriority: data.priority,
        userId,
        categoryId: category.id,
        checkList: {
          create: data.checkList.map((item,index) => ({
            title: item.title.trim(),
            completed: item.completed,
            order: index + 1,
          }))
        }
      },

      include: {
        category: true,
        user: true,
        checkList: true,
      },
    });

    return {
      success: true,
      message: "Todoを追加できました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Todoを追加できませんでした",
      data: null,
    };
  }
};
