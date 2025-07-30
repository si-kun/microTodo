import { addTodo } from '@/actions/addTodo';
import { updateTodo } from '@/actions/updateTodo';
import { TodoCompleteType, todosAtom } from '@/atom/todo';
import { CreateTodoSchema } from '@/schema/todoSchema';
import { useSetAtom } from 'jotai';
import  { useState } from 'react'
import toast from 'react-hot-toast';

interface UseTodoActionsProps {
    mode: 'create' | 'edit' | 'view';
    todo?: TodoCompleteType;
    onSuccess: () => void;
}


const useTodoActions = ({mode,todo,onSuccess}:UseTodoActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);

    const setTodos = useSetAtom(todosAtom);


      // Todoの追加処理
  const handleSubmitTodo = async (data: CreateTodoSchema) => {
    console.log(data);

    try {
      let result;
      setIsLoading(true);

      if (mode === "create") {
        result = await addTodo(data);
      } else if (mode === "edit" && todo) {
        result = await updateTodo(todo.id, data);
      } else {
        return;
      }

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (result.success && result.data) {
        toast.success(result.message);

        if (mode === "create") {
          setTodos((prev) => [...prev, result.data]);
        } else {
          setTodos((prev) =>
            prev.map((t) => (t.id === result.data.id ? result.data : t))
          );
        }
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

    return {
        isLoading,
        handleSubmitTodo,
    };

}

export default useTodoActions