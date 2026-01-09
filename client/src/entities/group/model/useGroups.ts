import { useInfiniteQuery } from "@tanstack/react-query";
import type { Group } from "./types";
import { fetchGroups } from "../api/groupApi";

export const GROUP_QUERY_KEY = "groups";
export const useGroups = (limit = 10) => {
  const query = useInfiniteQuery<Group[]>({
    queryKey: [GROUP_QUERY_KEY, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchGroups({
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const groups = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, groups };
};
