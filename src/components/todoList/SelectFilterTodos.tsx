import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSetAtom } from "jotai";
import { todoFilterAtom } from "@/atom/todo";

const SelectFilterTodos = () => {
  const setFilter = useSetAtom(todoFilterAtom);

  const handleFilterChange = (value: "all" | "incomplete" | "completed") => {
    setFilter(value);
  };

  return (
    <Select onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full mt-2">
        <SelectValue placeholder="Todoフィルター" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべて</SelectItem>
        <SelectItem value="incomplete">未完了</SelectItem>
        <SelectItem value="completed">完了</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectFilterTodos;
