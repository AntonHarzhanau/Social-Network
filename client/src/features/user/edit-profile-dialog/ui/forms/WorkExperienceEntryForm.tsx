import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { WorkExperienceUpsertInput } from "@/entities/user/model/types";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/FormInput";
import {
  optionalIsoDate,
  isoDate,
  trimmedRequired,
  trimmedOptional,
} from "../../model/zodPrimitives";

const workExperienceFormSchema = z.object({
  company: trimmedRequired,
  positionTitle: trimmedOptional,
  startAt: isoDate,
  endAt: optionalIsoDate,
});

type WorkExperienceEntryFormValues = z.infer<typeof workExperienceFormSchema>;

export function WorkExperienceEntryForm(props: {
  initial?: WorkExperienceUpsertInput;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (input: WorkExperienceUpsertInput) => Promise<void>;
}) {
  const form = useForm<WorkExperienceEntryFormValues>({
    resolver: zodResolver(workExperienceFormSchema),
    mode: "onChange",
    defaultValues: {
      company: props.initial?.company ?? "",
      positionTitle: props.initial?.positionTitle ?? "",
      startAt: props.initial?.startAt ?? "",
      endAt: props.initial?.endAt ?? "",
    },
  });

  const saving = !!props.saving;

  return (
    <form
      onSubmit={form.handleSubmit(async (v) => {
        await props.onSubmit({
          company: v.company.trim(),
          positionTitle: v.positionTitle.trim() || null,
          startAt: v.startAt,
          endAt: v.endAt ? v.endAt : null,
        });
      })}
      className="grid gap-3 p-3 rounded-lg border bg-card"
    >
      <FormInput name="company" control={form.control} label="Company" />
      <FormInput name="positionTitle" control={form.control} label="Position" />

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
