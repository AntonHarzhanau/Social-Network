import z from "zod";

export const editProfileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    bio: z.string().max(160, "Bio must be at most 160 characters long").optional(),
    // slug: z.string().min(3, "Slug must be at least 3 characters long"),
    location: z.string().max(100, "Location must be at most 100 characters long").optional(),
    maritalStatus: z.string().max(50, "Marital Status must be at most 50 characters long").optional(),
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
