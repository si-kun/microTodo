"use server";

import { prisma } from "@/lib/prisma";
import { Todo } from "@prisma/client";

type AddTodoProps = Pick<Todo, "title" | "completed">

export const addTodo = async (data: AddTodoProps) => {
  try {
    const result = await prisma.todo.create({
      data: {
        title: data.title,
        completed: data.completed,
      },
    });

    if(!result) {
        return {
            error: "Failed to add todo",
            message: "Todoを追加できませんでした"
        }
    }

    return {
        success: "Todoを追加できました",
        message: "Todoを追加できました",
        data: result
    }

  } catch (error) {
    console.error(error);
    return {
      error: "Failed to add todo",
      message: "Todoを追加できませんでした"
    }
  }
};
