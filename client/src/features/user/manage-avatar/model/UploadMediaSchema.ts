import { z } from "zod";

export const uploadMediaSchema = z
  .object({
    mediaIds: z.array(z.string()).nonempty("At least one media ID is required").default([]),
  })

export type UploadMediaPayload = z.input<typeof uploadMediaSchema>;
