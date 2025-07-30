import { createTodoSchema, CreateTodoSchema } from "@/schema/todoSchema";
import { TodoWithIncludes } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckListItem } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface useTodoFormProps {
  mode: "create" | "edit" | "view";
  todo?: TodoWithIncludes;
}

export const useTodoForm = ({ mode, todo }: useTodoFormProps) => {
  const form = useForm<CreateTodoSchema>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      completed: false,
      hasDeadline: true,
      startDate: undefined,
      dueDate: undefined,
      category: "",
      categoryColor: "#f0f0f0",
      priority: "low",
      checkList: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && todo) {
      form.reset({
        title: todo.title,
        completed: todo.completed,
        hasDeadline: todo.hasDeadline,
        startDate: todo.startDate ? new Date(todo.startDate) : undefined,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        category: todo.category?.name || "",
        categoryColor: todo.category?.color,
        priority: "low",
        checkList: todo.checkList.map((item: CheckListItem) => ({
          title: item.title,
          order: item.order,
          completed: item.completed,
        })),
      });
    } else if (mode === "create") {
      form.reset({
        title: "",
        completed: false,
        hasDeadline: true,
        startDate: undefined,
        dueDate: undefined,
        category: "",
        categoryColor: "#f0f0f0",
        priority: "low",
        checkList: [],
      });
    }
  }, [mode, todo, form]);

  return {
    mode,
    form,
  };
};
