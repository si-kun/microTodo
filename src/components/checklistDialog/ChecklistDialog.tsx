"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Delete, ListPlus } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { CheckListItem } from "@prisma/client";
import { Label } from "../ui/label";
import { CreateTodoSchema } from "@/schema/todoSchema";

interface ChecklistDialogProps {
  checkList: {
    title: string;
    order: number;
    completed: boolean;
  }[];
  setValue: UseFormSetValue<CreateTodoSchema>;
  triggerText: string;
}

const ChecklistDialog = ({
  checkList,
  setValue,
  triggerText,
}: ChecklistDialogProps) => {
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checkDialogOpen, setCheckDialogOpen] = useState(false);

  //チェックリストの総数
  const totalChecklist = checkList.length;

  //完了済みのチェックリスト
  const completedChecklist = checkList.filter(item => item.completed).length;

  const handleAddChecklist = () => {
    if (checklistTitle.trim() === "") {
      toast.error("タイトルが入力されていません");
      return;
    }

    const newCheckList = {
      title: checklistTitle.trim(),
      order: checkList.length + 1,
      completed: false,
    };

    setValue("checkList", [...checkList, newCheckList]);
    setChecklistTitle("");
  };

  const handleToggleChecklist = (index: number) => {
    const updatedCheckList = checkList.map((item) => {
      if (item.order === index) {
        return {
          ...item,
          completed: !item.completed,
        };
      }
      return item;
    });
    setValue("checkList", updatedCheckList as CheckListItem[]);
  };

  const handleDeleteChecklist = (index: number) => {
    const updatedCheckList = checkList.filter((item) => item.order !== index);
    setValue("checkList", updatedCheckList as CheckListItem[]);
  };

  const handleCloseDialog = () => {
    setCheckDialogOpen(false);
    setChecklistTitle("");
  };

  return (
    <Dialog open={checkDialogOpen} onOpenChange={setCheckDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="border-dashed shadow-none border-2 border-gray-100 bg-transparent"
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>チェックリスト項目の作成</DialogTitle>
          <DialogDescription>
            <span data-testid="checkCount">チェックリストの数 {completedChecklist} / {totalChecklist}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-1">
          <Input
            className="text-sm"
            placeholder="チェックリストのタイトル"
            value={checklistTitle}
            onChange={(e) => setChecklistTitle(e.target.value)}
          />
          <Button data-testid="addChecklist-button" variant={"secondary"} onClick={handleAddChecklist}>
            <ListPlus />
          </Button>
        </div>
        {checkList.length === 0 ? (
          <span className="text-">チェックリストが登録されていません</span>
        ) : (
          <ScrollArea className="flex-1 min-h-0">
            <ul className="flex flex-col gap-5">
              {checkList.map((item, index) => (
                <li key={index + 1} className="flex items-center gap-2">
                  <Checkbox
                    checked={item.completed}
                    id={String(item.order)}
                    onClick={() => handleToggleChecklist(item.order)}
                    data-testid={`checklist-${item.order}`}
                  />
                  <Label htmlFor={String(item.order)}>{item.title}</Label>
                  <Button
                    onClick={() => handleDeleteChecklist(item.order)}
                    variant={"destructive"}
                    type="button"
                    className="h-6 w-7 p-1 ml-auto"
                    data-testid={`deleteChecklist-${item.order}`}
                  >
                    <Delete />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
        <Button
          className="mt-auto"
          variant={"secondary"}
          type="button"
          onClick={handleCloseDialog}
          data-testid="closeChecklistDialog-button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistDialog;
