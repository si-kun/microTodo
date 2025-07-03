"use client";

import TodoList from "@/components/todoList/TodoList";
import SelectFilterTodos from "@/components/todoList/SelectFilterTodos";
import TodoProgress from "@/components/todoList/TodoProgress";
import AddTodoDialog from "@/components/addTodoDialog/AddTodoDialog";
export default function Home() {

  return (
    <div>
      <AddTodoDialog />
      <SelectFilterTodos />
      <TodoProgress />
      <TodoList />
    </div>
  );
}
