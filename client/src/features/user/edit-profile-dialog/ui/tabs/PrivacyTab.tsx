import { useFormContext } from "react-hook-form";
import { FormSelect } from "@/shared/components/FormSelect";
import type { EditProfileForm } from "../../model/schema";

const visibilityOptions = [
  { value: "public", label: "public" },
  { value: "friends", label: "friends" },
  { value: "private", label: "private" },
] as const;

type Visibility = (typeof visibilityOptions)[number]["value"];

export function PrivacyTab() {
  const { control } = useFormContext<EditProfileForm>();

  return (
    <div className="grid gap-4 overflow-auto pr-2">
      <FormSelect<EditProfileForm, Visibility>
        name="privacy.postsVisibility"
        control={control}
        label="Posts visibility"
        options={[...visibilityOptions]}
      />
      <FormSelect<EditProfileForm, Visibility>
        name="privacy.mediaVisibility"
        control={control}
        label="Media visibility"
        options={[...visibilityOptions]}
      />
      <FormSelect<EditProfileForm, Visibility>
        name="privacy.friendsVisibility"
        control={control}
        label="Friends visibility"
        options={[...visibilityOptions]}
      />
      <FormSelect<EditProfileForm, Visibility>
        name="privacy.profileVisibility"
        control={control}
        label="Profile visibility"
        options={[...visibilityOptions]}
      />
      <FormSelect<EditProfileForm, Visibility>
        name="privacy.groupsVisibility"
        control={control}
        label="Groups visibility"
        options={[...visibilityOptions]}
      />
    </div>
  );
}
