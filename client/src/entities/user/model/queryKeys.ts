export const userKeys = {
  all: ["users"] as const,

  list: (params: { limit: number; username?: string }) =>
    [...userKeys.all, "list", params] as const,

  profile: (userId: string) => [...userKeys.all, "profile", userId] as const,
  profileDetails: (userId: string) =>
    [...userKeys.all, "profileDetails", userId] as const,

  avatars: (userId: string) => [...userKeys.all, "avatars", userId] as const,
  medias: (userId: string, type: "image" | "video") =>
    [...userKeys.all, "medias", userId, type] as const,
  myPrivacy: () => ["me", "profile", "privacy"] as const,
};
