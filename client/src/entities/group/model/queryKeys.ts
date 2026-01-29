import type { GroupFilter, MemberStatus } from "./types";

export type GroupsListParams = {
  limit: number;
  groupName: string;
  filter: GroupFilter;
};

export type GroupMembersParams = {
  limit: number;
  status?: MemberStatus;
  q?: string;
};

export const groupKeys = {
  all: ["groups"] as const,

  lists: () => [...groupKeys.all, "list"] as const,
  list: (params: GroupsListParams) => [...groupKeys.lists(), params] as const,

  details: () => [...groupKeys.all, "detail"] as const,
  detail: (groupId: string) => [...groupKeys.details(), groupId] as const,

  members: (groupId: string) => [...groupKeys.all, "members", groupId] as const,
  membersList: (groupId: string, params: GroupMembersParams) =>
    [...groupKeys.members(groupId), params] as const,
} as const;
