import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { EducationUpsertInput } from "@/entities/user/model/types";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/FormInput";
import {
  optionalIsoDate,
  isoDate,
  trimmedRequired,
  trimmedOptional,
} from "../../model/zodPrimitives";

const educationFormSchema = z.object({
  institutionName: trimmedRequired,
  programName: trimmedOptional,
  degree: trimmedOptional,
  startAt: isoDate,
  endAt: optionalIsoDate,
});

type EducationEntryFormValues = z.infer<typeof educationFormSchema>;

export function EducationEntryForm(props: {
  initial?: EducationUpsertInput;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (input: EducationUpsertInput) => Promise<void>;
}) {
  const form = useForm<EducationEntryFormValues>({
    resolver: zodResolver(educationFormSchema),
    mode: "onChange",
    defaultValues: {
      institutionName: props.initial?.institutionName ?? "",
      programName: props.initial?.programName ?? "",
      degree: props.initial?.degree ?? "",
      startAt: props.initial?.startAt ?? "",
      endAt: props.initial?.endAt ?? "",
    },
  });

  const saving = !!props.saving;

  return (
    <form
      onSubmit={form.handleSubmit(async (v) => {
        await props.onSubmit({
          institutionName: v.institutionName.trim(),
          programName: v.programName.trim() || null,
          degree: v.degree.trim() || null,
          startAt: v.startAt,
          endAt: v.endAt ? v.endAt : null,
        });
      })}
      className="grid gap-3 p-3 rounded-lg border bg-card"
    >
      <FormInput
        name="institutionName"
        control={form.control}
        label="Institution"
      />
      <FormInput name="programName" control={form.control} label="Program" />
      <FormInput name="degree" control={form.control} label="Degree" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormInput
          name="startAt"
          control={form.control}
          label="Start"
          type="date"
        />
        <FormInput
          name="endAt"
          control={form.control}
          label="End"
          type="date"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={props.onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!form.formState.isValid || saving}>
          Save
        </Button>
      </div>
    </form>
  );
}
