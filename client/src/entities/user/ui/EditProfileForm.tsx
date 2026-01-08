import { FormInput } from "@/shared/components/FormInput";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  type EditProfileSchema,
} from "../model/EditProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserProfile } from "../model/types";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../api/userApi";
import { useMutationUserProfile } from "../model/useMutationUserProfile";

interface EditProfileFormProps {
  profileData?: UserProfile;
  userId?: string;
}

const EditProfileForm = ({ profileData, userId }: EditProfileFormProps) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: EditProfileSchema) => updateUserProfile(data),
        onSuccess: () => {
            if (userId) {
                queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
            }
        },
    });

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      bio: "",
    //   slug: "",
      location: "",
      maritalStatus: "",
    },
  });

  useEffect(() => {
    if (!profileData) return;

    form.reset({
      username: profileData.username ?? "",
      bio: profileData.bio ?? "",
    //   slug: profileData.slug ?? "",
      location: profileData.location ?? "",
      maritalStatus: profileData.maritalStatus ?? "",
    });
  }, [profileData, form]);

  const handleSubmit = (data: EditProfileSchema) => {
    mutation.mutate(data);
    console.log("Edited profile data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <form 
          id="edit-profile-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormInput
              name="username"
              control={form.control}
              label="Username"
              type="text"
              autoComplete="none"
            />
            <FormInput
              name="bio"
              control={form.control}
              label="Bio"
              type="text"
              placeholder="Bio"
              autoComplete="none"
            />
            {/* <FormInput
              name="slug"
              control={form.control}
              label="Slug"
              type="text"
              placeholder="Slug"
              autoComplete="none"
            /> */}
            <FormInput
              name="location"
              control={form.control}
              label="Location"
              type="text"
              placeholder="Location"
              autoComplete="none"
            />
            <FormInput
              name="maritalStatus"
              control={form.control}
              label="Marital Status"
              type="text"
              placeholder="Marital Status"
              autoComplete="none"
            />
            <Button
              type="submit"
              form="edit-profile-form"
              disabled={form.formState.isSubmitting}
              className="mt-4 w-full"
            >
              Save Changes
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
