import { useInfiniteQuery } from "@tanstack/react-query";
import type { GroupPreview } from "./types";
import { fetchGroups } from "../api/groupApi";

export const GROUP_QUERY_KEY = "groups";

type UseGroupsParams = {
  limit?: number;
  groupName?: string;
  forMe?: boolean;
};

export const useGroups = ({
  limit = 10,
  groupName = "",
  forMe = false,
}: UseGroupsParams = {}) => {
  //TODO: add normalization later
  const query = useInfiniteQuery<GroupPreview[]>({
    queryKey: [GROUP_QUERY_KEY, limit, groupName, forMe],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchGroups({
        page: pageParam as number,
        limit,
        groupName,
        forMe,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 20_000,
    gcTime: 120_000,
  });

  const groups = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, groups };
};
