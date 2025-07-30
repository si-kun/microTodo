import React from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { CreateTodoSchema } from "@/schema/todoSchema";
import { useCategories } from "@/hooks/useCategories";
import useCategorySelector from "@/hooks/useCategorySelector";

interface CategorySelectorProps {
  register: UseFormRegister<CreateTodoSchema>;
  isReadOnly: boolean;
  watch: UseFormWatch<CreateTodoSchema>;
  setValue: UseFormSetValue<CreateTodoSchema>;
}

const CategorySelector = ({
  register,
  isReadOnly,
  watch,
  setValue,
}: CategorySelectorProps) => {
  // カテゴリーを取得するカスタムフックを使用
  const { categories } = useCategories({
    autoFetch: true,
  });

  // カテゴリー選択のカスタムフック
  const {
    hasCustomInput,
    handleCategorySelect,
    handleInputCategoryChange,
    isExistingCategory,
    categoryValue,
  } = useCategorySelector({
    watch: watch,
    setValue: setValue,
  });

  return (
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
  );
};

export default CategorySelector;
