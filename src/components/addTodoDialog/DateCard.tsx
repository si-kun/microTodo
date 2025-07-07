import React from "react";
import { Card } from "../ui/card";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import SelectSchedule from "./SelectSchedule";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { CreateTodoSchema } from "@/schema/todoSchema";

interface DateCardProps {
  hasDeadline: boolean;
  control: Control<CreateTodoSchema>;
  setValue: UseFormSetValue<CreateTodoSchema>;
}

const DateCard = ({ hasDeadline, control, setValue }: DateCardProps) => {
  return (
    <Card className="p-4">
      {!hasDeadline && (
        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name={"startDate"}
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
            name={"dueDate"}
            render={({ field }) => (
              <SelectSchedule
                labelName="終了日"
                id="dueDate"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
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
    </Card>
  );
};

export default DateCard;
