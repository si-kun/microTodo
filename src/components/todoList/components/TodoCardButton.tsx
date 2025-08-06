import React from "react";
import { Button } from "../../ui/button";

interface TodoCardButtonProps {
  buttonName: string;
  onClick: () => void;
  variant?: "secondary" | "destructive";
}

const TodoCardButton = ({
  buttonName,
  onClick,
  variant = "secondary",
}: TodoCardButtonProps) => {
  return (
    <Button variant={variant} onClick={onClick}>
      {buttonName}
    </Button>
  );
};

export default TodoCardButton;
