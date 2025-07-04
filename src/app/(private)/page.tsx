"use client";

import TodoList from "@/components/todoList/TodoList";
import SelectFilterTodos from "@/components/todoList/SelectFilterTodos";
import TodoProgress from "@/components/todoList/TodoProgress";
import TodoDialog from "@/components/addTodoDialog/TodoDialog";
export default function Home() {

  return (
    <div>
      <TodoDialog mode="create" />
      <SelectFilterTodos />
      <TodoProgress />
      <TodoList />
    </div>
  );
}
