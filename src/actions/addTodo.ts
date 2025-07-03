"use server";

import { prisma } from "@/lib/prisma";
import { CreateTodoSchema } from "@/schema/todoSchema";

// type AddTodoProps = Omit<Todo, "createdAt" | "updatedAt" | "id">;

export const addTodo = async (data: CreateTodoSchema) => {
  try {
    const result = await prisma.todo.create({
      data: {
        title: data.title,
        completed: data.completed,
        hasDeadline: data.hasDeadline,
        startDate: data.startDate,
        dueDate: data.dueDate,
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
