import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useAtom, useAtomValue } from "jotai";
import { todoFilterAtom, todosAtom } from "@/atom/todo";
import { deleteTodo } from "@/actions/deleteTodo";
import toast from "react-hot-toast";
import { toggleTodo } from "@/actions/toggleTodo";
import { getAllTodos } from "@/actions/getAllTodos";
import TodoCardButton from "./TodoCardButton";
import TodoDialog from "../addTodoDialog/TodoDialog";

const TodoList = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const filter = useAtomValue(todoFilterAtom);
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

  const getFilteredTodos = () => {
    switch (filter) {
      case "incomplete":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

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
      {filteredTodos.length === 0 ? (
        <div className="flex justify-center items-center mt-4">
          <p className="text-center text-gray-500">Todoがありません</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 w-full mt-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`w-full rounded-lg border-1  p-2 ${todo.completed ? "bg-blue-100 border-blue-300" : "bg-gray-50 border-gray-200"}`}
            >
              <Label htmlFor={todo.id} className="flex items-start gap-3 ">
                <Checkbox
                  id={todo.id}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleComplete(todo.id)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                />
                <div className="flex flex-col gap-3 w-full mt-[1.2px]">
                  <p>{todo.title}</p>

                  <div className="flex items-center ">
                    {todo.hasDeadline ? (
                      <span>期限が設定されていません</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">
                          開始:
                          {todo.startDate
                            ? todo.startDate?.toLocaleDateString()
                            : "開始は未定です"}
                        </span>
                        <span className="text-sm text-gray-500">
                          期限:
                          {todo.startDate
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
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TodoList;
