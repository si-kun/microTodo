"use client";

import TodoList from "@/components/todoList/TodoList";
import SelectFilterTodos from "@/components/todoList/components/SelectFilterTodos";
import TodoProgress from "@/components/todoList/components/TodoProgress";
import SearchTodo from "@/components/todoList/components/SearchTodo";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function Home() {
  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <SearchTodo />
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
