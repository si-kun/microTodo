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
          userId: userResult.user.id,
          name: categoryName,
        },
      },
      update: {},
      create: {
        name: categoryName,
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
        isPriority: data.priority,
        userId: userResult.user.id,
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
