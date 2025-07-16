"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";
import { getUser } from "./user/getUser";

export const addTodo = async (data: CreateTodoSchema) => {
  try {
    const userResult = await getUser();
    if (!userResult.success || !userResult.user) {
      return {
        success: false,
        message: userResult.message || "ユーザー情報の取得に失敗しました",
        data: null,
      };
    }

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
          userId: userResult.user.id,
          name: data.category,
        },
      },
      update: {},
      create: {
        name: data.category || "未分類",
        userId: userResult.user.id,
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
        categoryId: category.id,
        isPriority: data.priority,
        userId: userResult.user.id,
      },
      include: {
        category: true,
        user: true,
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
