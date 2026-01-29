import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGroups } from "../api/groupApi";
import type { GroupPreview } from "./types";
import { groupKeys, type GroupsListParams } from "./queryKeys";

type UseGroupsParams = Partial<GroupsListParams> & { limit?: number };

export function useGroups(params: UseGroupsParams = {}) {
  const normalized: GroupsListParams = {
    limit: params.limit ?? 10,
    groupName: (params.groupName ?? "").trim(),
    filter: params.filter ?? "all",
  };

  const query = useInfiniteQuery({
    queryKey: groupKeys.list(normalized),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchGroups({
        page: pageParam,
        limit: normalized.limit,
        groupName: normalized.groupName,
        filter: normalized.filter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < normalized.limit) return undefined;
      return allPages.length + 1;
    },
    staleTime: 20_000,
    gcTime: 120_000,
  });

  const groups: GroupPreview[] = query.data?.pages.flat() ?? [];
  return { ...query, groups };
}
