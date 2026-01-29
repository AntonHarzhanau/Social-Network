import { apiClient } from "@/shared/api/apiClient";
import type {
  FetchGroupMembersResponse,
  Group,
  GroupFilter,
  GroupPreview,
  MemberRole,
  MemberStatus,
} from "../model/types";

export type FetchGroupsParams = {
  page?: number;
  limit?: number;
  groupName?: string;
  filter?: GroupFilter;
};

export const fetchGroups = async ({
  page = 1,
  limit = 10,
  groupName = "",
  filter = "all",
}: FetchGroupsParams): Promise<GroupPreview[]> => {
  const response = await apiClient.get<GroupPreview[]>("/groups", {
    params: { page, limit, groupName, filter },
  });
  return response.data;
};

export const createGroup = async (payload: {
  name: string;
  description?: string | null;
  visibility: "public" | "private";
}): Promise<void> => {
  await apiClient.post("/groups", payload);
};

export const fetchGroupById = async (groupId: string): Promise<Group> => {
  const response = await apiClient.get<Group>(`/groups/${groupId}`);
  return response.data;
};

export const updateGroupSettings = async (
  groupId: string,
  payload: Partial<Pick<Group, "name" | "description" | "visibility">>,
): Promise<void> => {
  await apiClient.put(`/groups/${groupId}`, payload);
};

export const setGroupAvatar = async (
  groupId: string,
  avatarId?: string | null,
): Promise<void> => {
  await apiClient.post<void>(`/groups/${groupId}/avatar`, {
    avatarId,
  });
};

export const setGroupCover = async (
  groupId: string,
  coverId?: string | null,
): Promise<void> => {
  await apiClient.post<void>(`/groups/${groupId}/cover`, {
    coverId,
  });
};

export const leaveGroup = async (groupId: string): Promise<void> => {
  await apiClient.post<void>(`/groups/${groupId}/leave`);
};

export const joinGroup = async (groupId: string): Promise<void> => {
  await apiClient.post<void>(`/groups/${groupId}/subscribe`);
};

export const fetchGroupMembers = async (
  groupId: string,
  page = 1,
  limit = 8,
  status?: MemberStatus,
  q?: string,
): Promise<FetchGroupMembersResponse> => {
  const response = await apiClient.get<FetchGroupMembersResponse>(
    `/groups/${groupId}/members`,
    { params: { page, limit, status, name: q } },
  );
  console.log("fetchGroupMembers response:", response.data);
  return response.data;
};

export const changeGroupMemberRole = async (payload: {
  memberId: string;
  newRole: MemberRole;
}): Promise<void> => {
  await apiClient.put(`/groups/members/${payload.memberId}/role`, {
    newRole: payload.newRole,
  });
};

export const changeGroupMemberStatus = async (payload: {
  memberId: string;
  newStatus: MemberStatus;
}): Promise<void> => {
  await apiClient.put(`/groups/members/${payload.memberId}/status`, {
    newStatus: payload.newStatus,
  });
};

export const rejectGroupJoinRequest = async (
  memberId: string,
): Promise<void> => {
  await apiClient.delete(`/groups/members/${memberId}`);
};
