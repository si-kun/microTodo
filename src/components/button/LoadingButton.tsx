import React from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

const LoadingButton = () => {
  return (
    <Button size="sm" disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button>
  );
};

export default LoadingButton;
