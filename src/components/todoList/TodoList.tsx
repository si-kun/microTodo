"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {  useAtomValue } from "jotai";
import { searchTodoTerm, todoFilterAtom } from "@/atom/todo";
import { deleteTodo } from "@/actions/todo/deleteTodo";
import toast from "react-hot-toast";
import { toggleTodo } from "@/actions/todo/toggleTodo";
import TodoCardButton from "./TodoCardButton";
import TodoDialog from "../addTodoDialog/TodoDialog";
import { CheckListItem, Todo } from "@prisma/client";
import Skeleton from "../Loading/Skeleton";
import LoadingCard from "../Loading/LoadingCard";
import { useTodos } from "@/hooks/useTodos";

interface TodoWithLoading extends Todo {
  isDeleting?: boolean;
  isToggling?: boolean;
  category?: {
    name: string;
    color: string;
  } | null;
  checkLists: CheckListItem[];
}

const TodoList = () => {

  const {todos,isLoading,updateTodoInState,removeTodoFromState} = useTodos({
    autoFetch: true,
  })

  const filter = useAtomValue(todoFilterAtom);

  const [displayTodos, setDisplayTodos] = useState<TodoWithLoading[]>([]);
  const searchTerm = useAtomValue(searchTodoTerm);

  console.log(displayTodos);

  useEffect(() => {
    let result: TodoWithLoading[] = todos.map((todo) => {
      return {
        ...todo,
        isDeleting: false,
        isToggling: false,
      };
    });

    // 1. まずフィルターを適用
    switch (filter) {
      case "incomplete":
        result = result.filter((todo) => !todo.completed);
        break;
      case "completed":
        result = result.filter((todo) => todo.completed);
        break;
      default:
        result = todos;
    }

    // 2 検索機能
    if (searchTerm.trim()) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayTodos(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, filter, searchTerm]);



  const handleDelete = async (id: string) => {
    try {
      setDisplayTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isDeleting: true } : todo
        )
      );

      const result = await deleteTodo(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      removeTodoFromState(id);
      toast.success(result.message);
    } catch (error) {
      console.error(error);
    } finally {
      setDisplayTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isDeleting: false } : todo
        )
      );
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      setDisplayTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isToggling: true } : todo
        )
      );

      const result = await toggleTodo(id);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      updateTodoInState(result.data);
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("予期しないエラーが発生しました");
    } finally {
      setDisplayTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isToggling: false } : todo
        )
      );
    }
  };

  const getEmptyMessage = () => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasFilter = filter !== "all";

    if (hasSearchTerm && hasFilter) {
      return "該当するTodoがありません";
    } else if (hasSearchTerm) {
      return "検索に該当するTodoがありません";
    } else if (hasFilter) {
      return "フィルターに該当するTodoがありません";
    } else {
      return "Todoがありません";
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      {displayTodos.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-center text-gray-500">{getEmptyMessage()}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 w-full">
          {displayTodos.map((todo) => {
            const today = new Date();
            const expired = todo.hasDeadline && !todo.completed && todo.dueDate && todo.dueDate < today;
            return (
              <li
                key={todo.id}
                className={`w-full rounded-lg border-1  p-2 ${
                  todo.completed
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                } relative`}
              >
                <Label htmlFor={todo.id} className="flex items-start gap-3 ">
                  <Checkbox
                    id={todo.id}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo.id)}
                    className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                  />
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <p>{todo.title}</p>
                      <span
                        style={{ backgroundColor: todo.category?.color }}
                        className={`text-xs px-2 py-1 rounded-md`}
                      >
                        {todo.category?.name}
                      </span>
                    </div>

                    <div className="flex items-center ">
                      {!todo.hasDeadline ? (
                        <span>期限が設定されていません</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-500">
                            開始:
                            {todo.startDate
                              ? todo.startDate?.toLocaleDateString()
                              : "開始は未定です"}
                          </span>
                          <span className={`text-sm  ${expired ? "text-red-500 font-bold" : "text-gray-500"}`}>
                            期限:
                            {todo.dueDate
                              ? todo.dueDate?.toLocaleDateString()
                              : "期限は未定です"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <TodoDialog mode="edit" todo={todo} />
                        <TodoCardButton
                          buttonName="削除"
                          variant="destructive"
                          onClick={() => handleDelete(todo.id)}
                        />
                      </div>
                    </div>
                  </div>
                </Label>
                {todo.isDeleting || (todo.isToggling && <LoadingCard />)}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default TodoList;
