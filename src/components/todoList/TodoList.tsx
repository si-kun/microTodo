import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useAtom, useAtomValue } from "jotai";
import { todoFilterAtom, todosAtom } from "@/atom/todo";
import { deleteTodo } from "@/actions/deleteTodo";
import toast from "react-hot-toast";
import { toggleTodo } from "@/actions/toggleTodo";
import { getAllTodos } from "@/actions/getAllTodos";
import { Todo } from "@prisma/client";

const TodoList = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const filter = useAtomValue(todoFilterAtom)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const result = await getAllTodos();

        if (!result.success || !result.data) {
          toast.error(result.message);
          return;
        }

        if (result.success && result.data) {
          setTodos(result.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Todoの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filterTodos = (filter: "all" | "incomplete" | "completed") => {

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTodo(id);

      if (result.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        toast.success(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const result = await toggleTodo(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? result.data! : todo))
      );
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("予期しないエラーが発生しました");
    }
  };

  return (
    <>
      {todos.length === 0 ? (
        <div className="flex justify-center items-center mt-4">
          <p className="text-center text-gray-500">Todoがありません</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 w-full mt-4">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2">
              <Checkbox
                id={todo.id}
                checked={todo.completed}
                onCheckedChange={() => handleToggleComplete(todo.id)}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
              />
              <Label
                htmlFor={todo.id}
                className={`flex-1 ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </Label>
              <Button
                variant={"destructive"}
                onClick={() => handleDelete(todo.id)}
              >
                削除
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TodoList;
