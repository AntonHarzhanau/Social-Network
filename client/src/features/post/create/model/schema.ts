import { VISIBILITY_VALUES } from "@/entities/post/api/postApi";
import { z } from "zod";

export const createPostSchema = z
  .object({
    content: z
      .string()
      .max(3000, "Content is too long").default(""),
    visibility: z.enum(VISIBILITY_VALUES, "Select visibility"),
    mediaIds: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    const hasText = data.content && data.content.trim().length > 0;
    const hasMedia = data.mediaIds.length > 0;

    if (!hasText && !hasMedia) {
      ctx.addIssue({
        code: "custom",
        message: "Add text or media",
        path: ["content"],
      });
    }
  });



export type CreatePostFormValues = z.input<typeof createPostSchema>;
export type CreatePostPayload = z.output<typeof createPostSchema>;
