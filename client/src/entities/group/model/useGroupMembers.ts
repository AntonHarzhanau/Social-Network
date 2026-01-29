import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGroupMembers } from "../api/groupApi";
import type { MemberStatus } from "./types";
import { groupKeys } from "./queryKeys";

export function useGroupMembers(params: {
  groupId: string;
  status: MemberStatus;
  q?: string;
  limit?: number;
  enabled?: boolean;
}) {
  const { groupId, status, q = "", limit = 8, enabled } = params;

  const query = useInfiniteQuery({
    queryKey: groupKeys.membersList(groupId, { status, limit, q }),
    enabled: enabled && !!groupId,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchGroupMembers(groupId, pageParam, limit, status, q),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.members.length === 0) return undefined;
      const loaded = allPages.reduce((acc, p) => acc + p.members.length, 0);
      return loaded >= lastPage.totalCount ? undefined : allPages.length + 1;
    },
    staleTime: 10_000,
    gcTime: 120_000,
  });

  const members = query.data?.pages.flatMap((p) => p.members) ?? [];
  const totalCount = query.data?.pages?.[0]?.totalCount ?? 0;

  return { ...query, members, totalCount };
}
