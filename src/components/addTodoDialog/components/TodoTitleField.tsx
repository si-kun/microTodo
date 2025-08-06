import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateTodoSchema } from "@/schema/todoSchema";

interface TodoTitleFieldProps {
  errors: FieldErrors<CreateTodoSchema>;
  register: UseFormRegister<CreateTodoSchema>;
  isReadOnly: boolean;
}

const TodoTitleField = ({
  errors,
  register,
  isReadOnly,
}: TodoTitleFieldProps) => {
  return (
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
  );
};

export default TodoTitleField;
