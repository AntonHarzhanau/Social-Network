import { z } from "zod";

const visibility = z.enum(["public", "friends", "private"]);
const marital = z.enum(["single", "married", "divorced", "widowed"]);

export const editProfileSchema = z.object({
  profile: z.object({
    username: z.string().trim().min(1, "Required"),
    location: z.string(),
    bio: z.string(),
    maritalStatus: z.union([z.literal(""), marital]),
    dateOfBirth: z.union([
      z.literal(""),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    ]),
  }),
  privacy: z.object({
    postsVisibility: visibility,
    mediaVisibility: visibility,
    friendsVisibility: visibility,
    profileVisibility: visibility,
    groupsVisibility: visibility,
  }),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
