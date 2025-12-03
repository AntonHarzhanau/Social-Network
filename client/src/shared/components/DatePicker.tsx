import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Calendar } from "@/shared/components/ui/calendar";

interface BaseFormInputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
}

export const DatePicker = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select your birth date",
}: BaseFormInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedDate = field.value as Date | undefined;

        const today = new Date();
        const thirteenYearsAgo = new Date(
          today.getFullYear() - 13,
          today.getMonth(),
          today.getDate(),
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={field.name}
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                  aria-invalid={fieldState.invalid}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ?? null);
                  }}
                  captionLayout="dropdown"
                  disabled={(date) => date > thirteenYearsAgo || date > today}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
