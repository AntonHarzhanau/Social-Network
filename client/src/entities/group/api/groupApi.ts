import { apiClient } from "@/shared/api/apiClient";
import type { Group, GroupPreview } from "../model/types";

export const fetchGroups = async ({
  page = 1,
  limit = 10,
}): Promise<GroupPreview[]> => {
  const response = await apiClient.get<GroupPreview[]>("/groups", {
    params: {
      page,
      limit,
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
  const response = await apiClient.post(`/groups/${groupId}/join`);
  return response.data;
};
