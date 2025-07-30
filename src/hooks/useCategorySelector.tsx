import { CreateTodoSchema } from "@/schema/todoSchema";
import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useCategories } from "./useCategories";

interface CategorySelectorProps {
  watch: UseFormWatch<CreateTodoSchema>;
  setValue: UseFormSetValue<CreateTodoSchema>;
}

const useCategorySelector = ({ watch, setValue }: CategorySelectorProps) => {
  const { categories } = useCategories({ autoFetch: true });

  const categoryValue = watch("category");

  const isExistingCategory = categories.some(
    (cat) => cat.name === categoryValue
  );

  const hasCustomInput = categoryValue !== "" && !isExistingCategory;

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

  return {
    isExistingCategory,
    categoryValue,
    hasCustomInput,
    handleCategorySelect,
    handleInputCategoryChange,
  }
};

export default useCategorySelector;
