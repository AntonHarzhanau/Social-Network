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

  clearable?: boolean;
  clearLabel?: string;

  triggerClassName?: string;
}

const CLEAR_VALUE = "__clear__";

export const FormSelect = <TFieldValues extends FieldValues, V extends string>({
  name,
  control,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
  clearable = false,
  clearLabel = "—",
  triggerClassName,
}: FormSelectProps<TFieldValues, V>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Select
            value={field.value ?? ""}
            onValueChange={(v) => {
              if (v === CLEAR_VALUE) field.onChange("");
              else field.onChange(v);
            }}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              className={triggerClassName ?? "w-full"}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {clearable && (
                <SelectItem value={CLEAR_VALUE}>{clearLabel}</SelectItem>
              )}

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
