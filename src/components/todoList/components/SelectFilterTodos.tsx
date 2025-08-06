import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useAtom, useAtomValue } from "jotai";
import { todoFilterAtom, todosAtom } from "@/atom/todo";

const SelectFilterTodos = () => {
  const todos = useAtomValue(todosAtom)
  const [filter, setFilter] = useAtom(todoFilterAtom);

  const handleFilterChange = (value: "all" | "incomplete" | "completed") => {
    setFilter(value);
  };

  const todosCount = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const incompleteCount = todosCount - completedCount;

  return (
    <Select value={filter} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full mt-2">
        <SelectValue placeholder="Todoフィルター" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべて({todosCount})</SelectItem>
        <SelectItem value="incomplete">未完了({incompleteCount})</SelectItem>
        <SelectItem value="completed">完了({completedCount})</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectFilterTodos;
