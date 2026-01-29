import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupById } from "../api/groupApi";
import type { Group } from "./types";
import { groupKeys } from "./queryKeys";

export function useGroup(groupId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => fetchGroupById(groupId),
    enabled: !!groupId,
    placeholderData: () => qc.getQueryData<Group>(groupKeys.detail(groupId)),
    staleTime: 20_000,
    gcTime: 120_000,
  });

  return { ...query };
}
