import { apiClient } from "@/shared/api/apiClient";
import type { Group } from "../model/types";

export const fetchGroups = async ({
  page = 1,
  limit = 10,
}): Promise<Group[]> => {
  const response = await apiClient.get<Group[]>("/groups", {
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
