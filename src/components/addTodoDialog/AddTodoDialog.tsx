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
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useSetAtom } from "jotai";
import { todosAtom } from "@/atom/todo";
import { addTodo } from "@/actions/addTodo";
import toast from "react-hot-toast";

const AddTodoDialog = () => {
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

  const hasDeadline = watch("hasDeadline");

  const setTodos = useSetAtom(todosAtom);

  //　ダイアログの開閉
  const [open, setOpen] = useState(false);

  // Todoの追加処理
  const handleAddTodo = async(data: CreateTodoSchema) => {

    try {
      const result = await addTodo(data);

      if(!result.success) {
        toast.error(result.message);
        return;
      }

      if(result.success && result.data) {
        toast.success(result.message);
        setTodos((prev) => [...prev, result.data])
        reset();
        setOpen(false);
      }
    } catch(error) {
      console.error("Error adding todo:", error);
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Todoを作成する</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit(handleAddTodo)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>新しいTodoを作成</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
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
              Todo Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
