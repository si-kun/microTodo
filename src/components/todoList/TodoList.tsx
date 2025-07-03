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
import { Input } from "../ui/input";
import { updateTodo } from "@/actions/updateTodo";

const TodoList = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const filter = useAtomValue(todoFilterAtom);
  const [isLoading, setIsLoading] = useState(false);

  // edit useState
  // const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

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

  const handleEdit = (todo: { id: string; title: string }) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditingTitle("");
  };

  const handleEditUpdate = async() => {
    try {
      if (!editingTitle.trim()) {
        toast.error("Todoを入力してください");
        return;
      }

      if (!editingTodoId) return;

      const originalTodo = todos.find((todo) => todo.id === editingTodoId);
      if (originalTodo?.title === editingTitle.trim()) {
        setEditingTodoId(null);
        return;
      }

      const result = await updateTodo(editingTodoId, editingTitle.trim());
      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingTodoId
            ? { ...todo, title: editingTitle.trim() }
            : todo
        )
      );

      setEditingTodoId(null);
      setEditingTitle("");
      toast.success("Todoを更新しました");
    } catch (error) {
      console.error(error);
      toast.error("Todoの更新に失敗しました");
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
            <li key={todo.id} className="flex items-center gap-2">
              <Checkbox
                id={todo.id}
                checked={todo.completed}
                onCheckedChange={() => handleToggleComplete(todo.id)}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
              />

              {editingTodoId === todo.id ? (
                <div className="flex flex-col gap-1 w-full">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    autoFocus
                  />

                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant={"secondary"} onClick={handleEditUpdate}>
                      更新
                    </Button>
                    <Button variant={"destructive"} onClick={handleEditCancel}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Label
                    htmlFor={todo.id}
                    className={`flex-1 ${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.title}
                  </Label>

                  <Button
                    variant={"secondary"}
                    onClick={() => handleEdit(todo)}
                  >
                    編集
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(todo.id)}
                  >
                    削除
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TodoList;
