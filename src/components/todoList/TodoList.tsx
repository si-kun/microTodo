import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useAtomValue } from "jotai";
import { todosAtom } from "@/atom/todo";

const TodoList = () => {

    const todos = useAtomValue(todosAtom);

  return (
    <ul className="flex flex-col gap-2 w-full mt-4">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-2">
          <Checkbox id={todo.id} />
          <Label
            htmlFor={todo.id}
            className={`flex-1 checked:line-through`}
          >
            {todo.title}
          </Label>
          <Button variant={"destructive"}>削除</Button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
