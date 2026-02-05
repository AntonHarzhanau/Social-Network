import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/FormInput";
import { useForm } from "react-hook-form";
import { changePasswordSchema, type ChangePasswordSchema } from "../../model/change-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword, deleteProfile } from "@/entities/user/api/userApi";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useState } from "react";
import { authActions } from "@/features/auth/model/authActions";


export function SecurityTab() {
  const [openConfirm, setOpenConfirm] = useState(false)
  

  const onDeleteConfirm = () => {
    try {
      deleteProfile()
      toast.success("Account deleted successfully", { closeButton: true })
      authActions.logout()

    } catch (error) {
      toast.error("Failed to delete account", { closeButton: true })
    }
  }

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: ChangePasswordSchema) => {
    try {
      await changePassword(data.oldPassword, data.newPassword)
      toast.success("Password changed successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to change password")
    }

    form.reset();
  };

  return (
    <div className="flex flex-col">
      <form
        id="change-password-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-4 overflow-auto pr-2">
        <div className="grid gap-2">
          <FormInput
            name="oldPassword"
            control={form.control}
            label="Old password"
            type="password"
            autoComplete="current-password"
            placeholder="Old password"
          />

          <FormInput
            name="newPassword"
            control={form.control}
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="New password"
          />

          <FormInput
            name="confirmNewPassword"
            control={form.control}
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              form.reset()
            }}
          >
            Clear
          </Button>

          <Button
            form="change-password-form"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>

            <Button onClick={() => setOpenConfirm(true)} variant="destructive" className="mt-3">Delete Account</Button>
            <ConfirmDialog 
              open={openConfirm}
              onOpenChange={setOpenConfirm}
              title="Are you sure you want to delete your account?"
              description="This action cannot be undone."
              confirmText="Delete"
              destructive
              onConfirm={onDeleteConfirm}
            />
    </div>
  );
}
