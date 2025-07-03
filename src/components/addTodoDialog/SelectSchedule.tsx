import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface SelectScheduleProps {
  labelName: string;
  id: string;
  value? : Date | null;
  onChange? (date: Date | undefined) :void

}

const SelectSchedule = ({ labelName, id, value, onChange }: SelectScheduleProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="px-1">
        {labelName}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-between font-normal"
          >
            {value ? value.toLocaleDateString("ja-JP") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectSchedule;
