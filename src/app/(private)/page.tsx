"use client";

import TodoList from "@/components/todoList/TodoList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { todoSchema, TodoSchema } from "@/schema/todoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTodo } from "@/actions/addTodo";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";
import { todosAtom } from "@/atom/todo";
import SelectFilterTodos from "@/components/todoList/SelectFilterTodos";
export default function Home() {
  const { register,handleSubmit,reset } = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      completed: false,
    },
  });


  const setTodos = useSetAtom(todosAtom)

  const handleAddTodo = async (data: TodoSchema) => {
    try {
      const result = await addTodo(data);

      if(result.error) {
        toast.error(result.message)
      }

      if(result.success) {
        toast.success(result.message)
        setTodos((prev) => [...prev, result.data])
        reset()
      }
      
    } catch(error) {
      console.error(error);
      toast.error("Todoを追加できませんでした")
    }
  }

  return (
    <div>
      <form className="flex items-center gap-2" onSubmit={handleSubmit(handleAddTodo)}>
        <Input {...register("title")} />
        <Button className="bg-blue-500 hover:bg-blue-600">追加</Button>
      </form>
      <SelectFilterTodos />
      <TodoList />
    </div>
  );
}
