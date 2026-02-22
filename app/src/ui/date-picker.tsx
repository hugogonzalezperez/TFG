import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../shared/lib/cn"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface DatePickerProps {
  date?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  className?: string
}

export function DatePicker({ date, onChange, placeholder = "Seleccionar fecha", minDate, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="select"
          className={cn(
            "w-full justify-start text-left font-normal h-12 px-4 border border-border hover:bg-foreground/5 hover:text-foreground transition-all",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? (
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          disabled={(date) => (minDate ? date < new Date(minDate.setHours(0, 0, 0, 0)) : false)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
