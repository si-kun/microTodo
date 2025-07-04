import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectSchedule from "./SelectSchedule";
import { Controller, useForm } from "react-hook-form";
import { createTodoSchema, CreateTodoSchema } from "@/schema/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useSetAtom } from "jotai";
import { todosAtom } from "@/atom/todo";
import { addTodo } from "@/actions/addTodo";
import toast from "react-hot-toast";
import { Todo } from "@prisma/client";
import { updateTodo } from "@/actions/updateTodo";

interface TodoDialogProps {
  mode: "create" | "edit"
  todo? : Todo
}

const TodoDialog = ({mode,todo}:TodoDialogProps) => {
  const { register, handleSubmit, reset, control, watch, setValue } =
    useForm<CreateTodoSchema>({
      resolver: zodResolver(createTodoSchema),
      defaultValues: {
        title: "",
        completed: false,
        hasDeadline: false,
        startDate: undefined,
        dueDate: undefined,
      },
    });

    useEffect(() => {
      if(mode === "edit" && todo) {
        reset({
          title: todo.title,
          completed: todo.completed,
          hasDeadline: todo.hasDeadline,
          startDate: todo.startDate ? new Date(todo.startDate) : undefined,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        })
      } else if (mode === "create") {
        reset({
          title: "",
          completed: false,
          hasDeadline: false,
          startDate: undefined,
          dueDate: undefined,
        })
      }
    },[mode, todo, reset]);

  const hasDeadline = watch("hasDeadline");

  const setTodos = useSetAtom(todosAtom);

  //　ダイアログの開閉
  const [open, setOpen] = useState(false);

  // Todoの追加処理
  const handleSubmitTodo = async(data: CreateTodoSchema) => {

    try {

      let result;

      if(mode === "create") {
        result = await addTodo(data);
      } else if(mode === "edit" && todo) {
        result = await updateTodo(todo.id, data);
      } else {
        return;
      }


      if(!result.success) {
        toast.error(result.message);
        return;
      }

      if(result.success && result.data) {
        toast.success(result.message);

        if (mode === "create") {
          setTodos((prev) => [...prev, result.data])
        } else {
          setTodos((prev) => (
            prev.map((t) => t.id === result.data.id ? result.data : t)
          ))
        }
        reset();
        setOpen(false);
      }
    } catch(error) {
      console.error("Error adding todo:", error);
      return;
    }
  };

  const dialogTitle = mode === "create" ? "Todoを作成する" : "編集"

  const dialogDescription = mode === "create"
  ? "新しいTodoを作成します。必要な情報を入力してください。"
  : "Todoの内容を編集します。変更後、保存ボタンをクリックしてください。";

  const submitButtonText = mode === "create" ? "Todo Create" : "Todo Update";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{dialogTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit(handleSubmitTodo)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="todoTitle">Todo Title</Label>
              <Input
                id="todoTitle"
                placeholder="Create New Todo"
                {...register("title")}
              />
            </div>

            {!hasDeadline && (
              <>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <SelectSchedule
                      labelName="開始日"
                      id="startDate"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <SelectSchedule
                      labelName="終了日"
                      id="dueDate"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </>
            )}
            <div className="flex items-center gap-1">
              <Checkbox
                id="hasDeadline"
                checked={hasDeadline}
                onCheckedChange={
                  (checked) => setValue("hasDeadline", checked === true) // 値を更新
                }
              />
              <Label htmlFor="hasDeadline">日付未定</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-500">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
