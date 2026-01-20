import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Option<V extends string> = { value: V; label: string };

interface FormSelectProps<TFieldValues extends FieldValues, V extends string> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: Option<V>[];
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelect = <TFieldValues extends FieldValues, V extends string>({
  name,
  control,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
}: FormSelectProps<TFieldValues, V>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              className="w-10"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
