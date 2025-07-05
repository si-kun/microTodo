import { Progress } from "../ui/progress";
import { useAtomValue } from "jotai";
import { todosAtom } from "@/atom/todo";

const TodoProgress = () => {
  const todos = useAtomValue(todosAtom);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const progressValue = Math.round((completedTodos / todos.length) * 100);

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
          全体: {todos.length}件
        </p>
        <p className="text-sm text-muted-foreground">
          完了: {completedTodos}件
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={progressValue} className="[&>*]:bg-green-500" />
        <span className="text-sm font-medium">{todos.length === 0 ? 0 : progressValue}%</span>
      </div>
    </div>
  );
};

export default TodoProgress;
