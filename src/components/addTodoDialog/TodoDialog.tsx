import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import DateCard from "./components/DateCard";
import ChecklistDialog from "../checklistDialog/ChecklistDialog";
import { useTodoForm } from "@/hooks/useTodoForm";
import useTodoActions from "@/hooks/useTodoActions";
import TodoTitleField from "./components/TodoTitleField";
import CategorySelector from "./components/CategorySelector";
import PriorityField from "./components/PriorityField";
import TodoDialogFooter from "./components/TodoDialogFooter";
import { TodoWithIncludes } from "@/types/api";

interface TodoDialogProps {
  mode: "create" | "edit" | "view";
  todo?: TodoWithIncludes;
  isOpen?: boolean;
  onClose?: () => void;
}

const TodoDialog = ({ mode, todo, isOpen, onClose }: TodoDialogProps) => {
  // Todoのフォームを管理するカスタムフック
  const { form } = useTodoForm({ mode, todo });

  // Todoの作成・編集・削除のアクションを管理するカスタムフック
  const { isLoading, handleSubmitTodo } = useTodoActions({
    mode,
    todo,
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const hasDeadline = watch("hasDeadline");
  const checkList = watch("checkList");

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

  const dialogDescription =
    mode === "create"
      ? "新しいTodoを作成します。必要な情報を入力してください。"
      : "Todoの内容を編集します。変更後、保存ボタンをクリックしてください。";

  const submitButtonText = mode === "create" ? "Todo Create" : "Todo Update";

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
            {/* Todoタイトル入力フィールド */}
            <TodoTitleField
              errors={errors}
              register={register}
              isReadOnly={isReadOnly}
            />

            {/* チェックリスト */}
            <ChecklistDialog
              checkList={checkList || []}
              setValue={setValue}
              triggerText={
                mode === "edit"
                  ? "チェックリストを編集する"
                  : "チェックリストを追加する"
              }
            />

            {/* 日時選択フィールド */}
            <DateCard
              hasDeadline={hasDeadline}
              control={control}
              setValue={setValue}
              disabled={isReadOnly}
            />

            {/* カテゴリー選択 */}
            <CategorySelector
              register={register}
              isReadOnly={isReadOnly}
              watch={watch}
              setValue={setValue}
            />

            {/* 優先度 */}
            <PriorityField control={control} isReadOnly={isReadOnly} />
          </div>
          <TodoDialogFooter
            isLoading={isLoading}
            reset={reset}
            submitButtonText={submitButtonText}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
