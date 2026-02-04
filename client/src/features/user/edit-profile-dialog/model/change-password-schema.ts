import z from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty("Old password is required"),
    newPassword: z.string().nonempty("New password is required"),
    confirmNewPassword: z.string().min(1, "Confirm new password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      });
      return;
    }
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;