import { VISIBILITY_VALUES } from "@/shared/api/post";
import { Field, FieldError } from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface VisibilitySelectorProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

const VisibilitySelector = <TFieldValues extends FieldValues>({
  name,
  control,
}: VisibilitySelectorProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="responsive">
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={VISIBILITY_VALUES.PUBLIC}>Public</SelectItem>
              <SelectItem value={VISIBILITY_VALUES.FRIENDS}>Friends</SelectItem>
              <SelectItem value={VISIBILITY_VALUES.GROUP}>Group</SelectItem>
              <SelectItem value={VISIBILITY_VALUES.PRIVATE}>Private</SelectItem>
            </SelectContent>
          </Select>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default VisibilitySelector;
