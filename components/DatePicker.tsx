"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    if (dateString) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        onChange?.(date);
      }
    } else {
      onChange?.(undefined);
    }
  };

  // Fallback to HTML5 date input if popover fails to open
  const handleButtonClick = () => {
    try {
      setOpen(true);
      // If popover doesn't open after a brief delay, show fallback
      setTimeout(() => {
        if (!open) {
          setShowFallback(true);
        }
      }, 100);
    } catch (error) {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return (
      <div className="flex gap-2">
        <Input
          type="date"
          disabled={disabled}
          value={value ? format(value, "yyyy-MM-dd") : ""}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFallback(false)}
          className="px-2"
        >
          📅
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          onClick={handleButtonClick}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
