import type z from "zod";
import { toDateOnly } from "../lib/todayOnly";
import { registerFormSchema } from "./registerFormSchema";

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
