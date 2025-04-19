import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            value.toLocaleString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          ) : (
            <span>Pick date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-auto bg-white rounded-lg shadow-lg">
        <ReactDatePicker
          selected={value}
          onChange={(date) => onChange?.(date)}
          showTimeSelect
          timeIntervals={15}
          minDate={new Date()}
          minTime={new Date(new Date().setHours(0, 0, 0, 0))}
          maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          calendarClassName="!bg-white !border !rounded-lg !shadow-md"
          popperClassName="!z-[9999]"
          wrapperClassName="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
