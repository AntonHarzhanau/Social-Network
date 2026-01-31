import { useUserProfile as useUserProfileQuery } from "@/entities/user/model/useUserQueries";

export const useUserProfile = (userId?: string) =>
  useUserProfileQuery({ userId: userId ?? "", enabled: !!userId });
