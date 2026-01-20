import z from "zod";

export const CreateGroupSchema = z.object({
  name: z.string().min(2).max(100),
  visibility: z.enum(["public", "private"]),
});

export type CreateGroupValues = z.infer<typeof CreateGroupSchema>;
