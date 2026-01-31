import { useInfiniteQuery } from "@tanstack/react-query";
import type { UserPreview } from "./types";
import { fetchUsers } from "../api/userApi";
import { userKeys } from "./queryKeys";

export function useUserSearch(limit = 10, search?: string) {
  const q = (search ?? "").trim();

  return useInfiniteQuery<UserPreview[]>({
    queryKey: userKeys.list({ username: q, limit }),
    enabled: true,
    initialPageParam: 1,

    queryFn: ({ pageParam, signal }) =>
      fetchUsers(pageParam as number, limit, q, signal),

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length + 1,
  });
}
