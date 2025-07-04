"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";
import { getUser } from "./user/getUser";

// type AddTodoProps = Omit<Todo, "createdAt" | "updatedAt" | "id">;

export const addTodo = async (data: CreateTodoSchema) => {
  try {

    const userResult = await getUser();
    if (!userResult.success || !userResult.user) {
      return {
        success: false,
        message: userResult.message || "ユーザー情報の取得に失敗しました",
        data: null
      };
    }

    const result = await prisma.todo.create({
      data: {
        title: data.title,
        completed: data.completed,
        hasDeadline: data.hasDeadline,
        startDate: data.startDate,
        dueDate: data.dueDate,
        userId: userResult.user.id,
      },
    });

    return {
        success: true,
        message: "Todoを追加できました",
        data: result
    }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Todoを追加できませんでした",
      data: null
    }
  }
};
