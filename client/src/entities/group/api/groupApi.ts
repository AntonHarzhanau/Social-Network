import { apiClient } from "@/shared/api/apiClient";
import type {
  FetchGroupMembersResponse,
  Group,
  GroupPreview,
  GroupRequestStatus,
} from "../model/types";

export const fetchGroups = async ({
  page = 1,
  limit = 10,
  groupName = "",
  forMe = false,
}: {
  page?: number;
  limit?: number;
  groupName?: string;
  forMe?: boolean;
}): Promise<GroupPreview[]> => {
  const response = await apiClient.get<GroupPreview[]>("/groups", {
    params: {
      page,
      limit,
      groupName,
      forMe,
    },
  });
  return response.data;
};

export const createGroup = async (name: string): Promise<void> => {
  const response = await apiClient.post("/groups", { name });
  return response.data;
};

export const fetchGroupById = async (groupId: string): Promise<Group> => {
  const response = await apiClient.get<Group>(`/groups/${groupId}`);
  return response.data;
};

export const setGroupAvatar = async (
  groupId: string,
  avatarId?: string | null,
): Promise<void> => {
  const response = await apiClient.post(`/groups/${groupId}/avatar`, {
    avatarId,
  });
  return response.data;
};

export const leaveGroup = async (groupId: string): Promise<void> => {
  const response = await apiClient.post(`/groups/${groupId}/leave`);
  return response.data;
};

export const joinGroup = async (groupId: string): Promise<void> => {
  const response = await apiClient.post(`/groups/${groupId}/subscribe`);
  return response.data;
};

export const fetchGroupMembers = async (
  groupId: string,
  page = 1,
  limit = 8,
  status?: GroupRequestStatus,
): Promise<FetchGroupMembersResponse> => {
  const response = await apiClient.get<FetchGroupMembersResponse>(
    `/groups/${groupId}/members`,
    {
      params: {
        page,
        limit,
        status,
      },
    },
  );
  return response.data;
};

export const changeGroupMemberRole = async (
  memberId: string,
  newRole: string,
): Promise<void> => {
  const response = await apiClient.put(`/groups/members/${memberId}/role`, {
    newRole,
  });
  return response.data;
};

export const changeGroupMemberStatus = async (
  memberId: string,
  newStatus: string,
): Promise<void> => {
  const response = await apiClient.put(`/groups/members/${memberId}/status`, {
    newStatus,
  });
  return response.data;
};
