import { useUserProfileDetails as useUserProfileDetailsQuery } from "@/entities/user/model/useUserQueries";

export const useUserProfileDetails = (userId?: string, enabled = false) =>
  useUserProfileDetailsQuery({
    userId: userId ?? "",
    enabled: enabled && !!userId,
  });
