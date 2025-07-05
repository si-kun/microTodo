import React from "react";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

interface ErrorMessage<T extends FieldValues> {
  errors: FieldErrors<T>;
  name: keyof T;
}

const ErrorMessage = <T extends FieldErrors>({
  name,
  errors,
}: ErrorMessage<T>) => {
  const error = errors[name] as FieldError | undefined;

  if (!error) return null;

  return (
    <span className="text-xs text-red-500 font-bold">{error.message}</span>
  );
};

export default ErrorMessage;
