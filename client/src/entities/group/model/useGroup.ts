import { useQuery } from "@tanstack/react-query";
import type { Group } from "./types";
import { fetchGroupById } from "../api/groupApi";

export const GROUP_QUERY_KEY = "groups";
export const useGroup = (groupId: string) => {
  const query = useQuery<Group>({
    queryKey: [GROUP_QUERY_KEY, groupId],
    queryFn: () => fetchGroupById(groupId),
    enabled: !!groupId,
  });

  return { ...query};
};
