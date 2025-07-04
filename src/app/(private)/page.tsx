"use client";

import TodoList from "@/components/todoList/TodoList";
import SelectFilterTodos from "@/components/todoList/SelectFilterTodos";
import TodoProgress from "@/components/todoList/TodoProgress";
import TodoDialog from "@/components/addTodoDialog/TodoDialog";
import SearchTodo from "@/components/todoList/SearchTodo";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function Home() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <SearchTodo />
          <TodoDialog mode="create" />
        </div>
        <SelectFilterTodos />
        <TodoProgress />
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <TodoList />
      </ScrollArea>
    </div>
  );
}
