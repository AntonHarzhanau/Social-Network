import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { FormInput } from "@/shared/components/FormInput";
import { FormSelect } from "@/shared/components/FormSelect";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { MONTHS, days, years, splitIso, toIso } from "../../lib/date";
import type { EditProfileForm } from "../../model/schema";

export function GeneralTab(props: {
  avatarUrl?: string | null;
  displayName?: string;
}) {
  const { control, setValue, watch, formState } =
    useFormContext<EditProfileForm>();

  const iso = watch("profile.dateOfBirth");
  const parts = useMemo(() => splitIso(iso), [iso]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full overflow-hidden bg-muted shrink-0">
          {props.avatarUrl ? (
            <img
              src={props.avatarUrl}
              alt="avatar"
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-sm text-muted-foreground">
              N/A
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold truncate">
            {props.displayName ?? "Profile"}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4 overflow-auto pr-2">
        <FormInput<EditProfileForm>
          name="profile.username"
          control={control}
          label="Username"
          placeholder="Your username"
        />

        <FormSelect<
          EditProfileForm,
          "single" | "married" | "divorced" | "widowed"
        >
          name="profile.maritalStatus"
          control={control}
          label="Marital status"
          placeholder="Select..."
          clearable
          clearLabel="—"
          options={[
            { value: "single", label: "single" },
            { value: "married", label: "married" },
            { value: "divorced", label: "divorced" },
            { value: "widowed", label: "widowed" },
          ]}
        />

        <FormInput<EditProfileForm>
          name="profile.location"
          control={control}
          label="Location"
          placeholder="City, Country"
        />

        {/* Bio textarea (через Field как у тебя) */}
        <div>
          <Field data-invalid={!!formState.errors.profile?.bio}>
            <FieldLabel htmlFor="profile.bio">Bio</FieldLabel>
            <Textarea
              id="profile.bio"
              value={watch("profile.bio")}
              onChange={(e) =>
                setValue("profile.bio", e.target.value, { shouldDirty: true })
              }
              rows={4}
            />
            {formState.errors.profile?.bio && (
              <FieldError errors={[formState.errors.profile.bio]} />
            )}
          </Field>
        </div>

        {/* DOB 3 selects -> profile.dateOfBirth */}
        <Field data-invalid={!!formState.errors.profile?.dateOfBirth}>
          <FieldLabel>Date of birth</FieldLabel>

          <div className="grid grid-cols-3 gap-2">
            <Select
              value={parts.d}
              onValueChange={(d) =>
                setValue("profile.dateOfBirth", toIso(parts.y, parts.m, d), {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days().map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={parts.m}
              onValueChange={(m) =>
                setValue("profile.dateOfBirth", toIso(parts.y, m, parts.d), {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={parts.y}
              onValueChange={(y) =>
                setValue("profile.dateOfBirth", toIso(y, parts.m, parts.d), {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years(1920).map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formState.errors.profile?.dateOfBirth && (
            <FieldError errors={[formState.errors.profile.dateOfBirth]} />
          )}
        </Field>
      </div>
    </div>
  );
}
