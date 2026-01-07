import type z from "zod";
import { registerFormSchema } from "./registerFormSchema";
import { toDateOnly } from "@/shared/lib/todayOnly";

export const registerApiSchema = registerFormSchema
  .omit({ confirmPassword: true })
  .transform((data) => ({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: toDateOnly(data.dateOfBirth),
    password: data.password,
  }));

export type RegisterApiPayload = z.infer<typeof registerApiSchema>;
