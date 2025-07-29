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
import { Controller, useForm } from "react-hook-form";
import { createTodoSchema, CreateTodoSchema } from "@/schema/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { todosAtom, TodoWithCategoryChecklist } from "@/atom/todo";
import { addTodo } from "@/actions/addTodo";
import toast from "react-hot-toast";
import { updateTodo } from "@/actions/updateTodo";
import LoadingButton from "../button/LoadingButton";
import DateCard from "./DateCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { useCategories } from "@/hooks/useCategories";
import ChecklistDialog from "../checklistDialog/ChecklistDialog";
import { CheckListItem } from "@prisma/client";

interface TodoDialogProps {
  mode: "create" | "edit" | "view";
  todo?: TodoWithCategoryChecklist;
  isOpen?: boolean;
  onClose?: () => void;
}

const TodoDialog = ({ mode, todo, isOpen, onClose }: TodoDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { categories } = useCategories({
    autoFetch: true,
  });

  const PRIORITY_OPTIONS = [
    {
      value: "low",
      label: "低",
      borderClass: "border-green-600",
      bgClass: "bg-green-200",
      hoverClass: "hover:bg-green-300",
    },
    {
      value: "normal",
      label: "中",
      borderClass: "border-yellow-600",
      bgClass: "bg-yellow-200",
      hoverClass: "hover:bg-yellow-300",
    },
    {
      value: "high",
      label: "高",
      borderClass: "border-red-600",
      bgClass: "bg-red-200",
      hoverClass: "hover:bg-red-300",
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTodoSchema>({
    resolver: zodResolver(createTodoSchema) as any,
    defaultValues: {
      title: "",
      completed: false,
      hasDeadline: true,
      startDate: undefined,
      dueDate: undefined,
      category: "",
      categoryColor: "#f0f0f0",
      priority: "low",
      checkLists: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && todo) {
      reset({
        title: todo.title,
        completed: todo.completed,
        hasDeadline: todo.hasDeadline,
        startDate: todo.startDate ? new Date(todo.startDate) : undefined,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        category: todo.category?.name,
        categoryColor: todo.category?.color,
        priority: "low",
        checkLists: todo.checkLists.map((item: CheckListItem) => ({
          title: item.title,
          order: item.order,
          completed: item.completed,
        })),
      });
    } else if (mode === "create") {
      reset({
        title: "",
        completed: false,
        hasDeadline: true,
        startDate: undefined,
        dueDate: undefined,
        category: "",
        categoryColor: "#f0f0f0",
        priority: "low",
        checkLists: [],
      });
    }
  }, [mode, todo, reset]);

  const hasDeadline = watch("hasDeadline");
  const categoryValue = watch("category");
  const checkLists = watch("checkLists");
  const isExistingCategory = categories.some(
    (cat) => cat.name === categoryValue
  );
  const hasCustomInput = categoryValue !== "" && !isExistingCategory;

  const setTodos = useSetAtom(todosAtom);

  // ダイアログの開閉
  const [open, setOpen] = useState(false);
  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const handleOpenChange = (newOpen: boolean) => {
    if (isOpen !== undefined) {
      onClose?.();
    } else {
      setOpen(newOpen);
    }
  };
  const isReadOnly = mode === "view";
  const dialogTriggerTitle =
    mode === "create"
      ? "Todoを作成する"
      : mode === "edit"
      ? "編集"
      : "Todoの詳細";

  const dialogTitle =
    mode === "edit" ? `${todo?.title}の編集` : dialogTriggerTitle;

  // Todoの追加処理
  const handleSubmitTodo = async (data: CreateTodoSchema) => {
    console.log(data);

    try {
      let result;
      setIsLoading(true);

      if (mode === "create") {
        result = await addTodo(data);
      } else if (mode === "edit" && todo) {
        result = await updateTodo(todo.id, data);
      } else {
        return;
      }

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (result.success && result.data) {
        toast.success(result.message);

        if (mode === "create") {
          setTodos((prev) => [...prev, result.data]);
        } else {
          setTodos((prev) =>
            prev.map((t) => (t.id === result.data.id ? result.data : t))
          );
        }
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const dialogDescription =
    mode === "create"
      ? "新しいTodoを作成します。必要な情報を入力してください。"
      : "Todoの内容を編集します。変更後、保存ボタンをクリックしてください。";

  const submitButtonText = mode === "create" ? "Todo Create" : "Todo Update";

  const handleCategorySelect = (value: string) => {
    setValue("category", value);

    const selectedCat = categories.find((cat) => cat.name === value);
    if (selectedCat) {
      setValue("categoryColor", selectedCat.color);
    }
  };

  const handleInputCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue("category", e.target.value);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {mode !== "view" && (
        <DialogTrigger asChild>
          <Button variant="outline">{dialogTriggerTitle}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit(handleSubmitTodo)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Label htmlFor="todoTitle">Todo Title</Label>
                {errors.title && (
                  <span className="text-sm text-red-400 font-bold">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <Input
                id="todoTitle"
                placeholder="Create New Todo"
                {...register("title")}
                disabled={isReadOnly}
              />
            </div>

            <ChecklistDialog
              checkLists={checkLists}
              setValue={setValue}
              triggerText={mode === "edit" ? "チェックリストを編集する" : "チェックリストを追加する"}
            />

            <DateCard
              hasDeadline={hasDeadline}
              control={control}
              setValue={setValue}
              disabled={isReadOnly}
            />

            {/* カテゴリー選択 */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Label className="whitespace-nowrap">カテゴリーを選択</Label>
                <Input
                  type="color"
                  className="w-[100px] border-none"
                  {...register("categoryColor")}
                  disabled={isReadOnly}
                />
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={isExistingCategory ? categoryValue : ""}
                  onValueChange={handleCategorySelect}
                  disabled={hasCustomInput || isReadOnly}
                >
                  <SelectTrigger className="w-[50%]">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="新規カテゴリー"
                  className="w-[50%]"
                  onChange={handleInputCategoryChange}
                  disabled={isReadOnly}
                />
              </div>
            </Card>

            {/* 優先度 */}
            <div className="flex flex-col gap-1">
              <Label>優先度を選択</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-4">
                    {PRIORITY_OPTIONS.map((option) => (
                      <Card
                        key={option.value}
                        className={`text-center cursor-pointer border-2 ${
                          field.value === option.value
                            ? `${option.borderClass} ${option.bgClass} ${option.hoverClass}` // 選択されている場合のスタイル
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={
                          isReadOnly
                            ? undefined
                            : () => field.onChange(option.value)
                        }
                      >
                        <span className="font-bold">{option.label}</span>
                      </Card>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <LoadingButton />
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant={"destructive"} onClick={() => reset()}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-500">
                  {submitButtonText}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
