import { useQuery } from "@tanstack/react-query";
import { friendsQueryKeys } from "./queryKeys";
import { fetchMyFriendsStats, fetchPublicFriendsStats } from "../api/friends";

export const useMyFriendsStats = (enabled = true) => {
  return useQuery({
    queryKey: friendsQueryKeys.stats.me(),
    queryFn: fetchMyFriendsStats,
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const usePublicFriendsStats = (userId?: string) => {
  return useQuery({
    queryKey: userId
      ? friendsQueryKeys.stats.user(userId)
      : ["friends", "stats", "user", "disabled"],
    queryFn: () => fetchPublicFriendsStats(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
};
