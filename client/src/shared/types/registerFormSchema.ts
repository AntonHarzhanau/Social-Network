import z from "zod";

export const registerFormSchema = z
  .object({
    email: z.email(),
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),
    dateOfBirth: z.date(),
    password: z.string().nonempty("Password is required"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
      return;
    }

    const birth = data.dateOfBirth;
    if (!(birth instanceof Date) || Number.isNaN(birth.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid date",
        path: ["dateOfBirth"],
      });
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age < 13) {
      ctx.addIssue({
        code: "custom",
        message: "You must be at least 13 years old to register",
        path: ["dateOfBirth"],
      });
      return;
    }
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
