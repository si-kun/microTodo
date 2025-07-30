import { getAllTodos } from "@/actions/todo/getAllTodos";
import { todosAtom } from "@/atom/todo";
import { TodoWithIncludes } from "@/types/api";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UseTodosOptions {
  autoFetch?: boolean;
  onError?: (message: string) => void;
}

export const useTodos = (options: UseTodosOptions = {}) => {
  const { autoFetch = true, onError } = options;
  const [todos, setTodos] = useAtom(todosAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 手動でTodoを取得する関数
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllTodos();

      if (!result.success || !result.data) {
        const errorMessage = result.message || "Todoの取得に失敗しました";
        setError(errorMessage);
        onError?.(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      setTodos(result.data);
      return true;
    } catch (error) {
      const errorMessage = "予期しないエラーが発生しました";
      console.error(error);
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setTodos, onError]);

  // 自動取得の処理
  useEffect(() => {
    if (autoFetch) {
      fetchTodos();
    }
  }, [autoFetch, fetchTodos]);

  // Todoの更新、削除、追加のヘルパー関数
  const updateTodoInState = useCallback(
    (updatedTodo: TodoWithIncludes) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    },
    [setTodos]
  );

  const addTodoToState = useCallback(
    (newTodo: TodoWithIncludes) => {
      setTodos((prev) => [...prev, newTodo]);
    },
    [setTodos]
  );

  const removeTodoFromState = useCallback(
    (todoId: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    },
    [setTodos]
  );

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    updateTodoInState,
    addTodoToState,
    removeTodoFromState,

    // Todoの計算
    completedCount: todos.filter((todo) => todo.completed).length,
    totalCount: todos.length,
  };
};
