import type { UserPreview } from "@/entities/user/model/types";
import { apiClient } from "@/shared/api/apiClient";

export const fetchFriends = async (
  userId: string | undefined,
  page: number = 1,
  limit: number = 8,
): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(`/friends/${userId}`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const fetchFriendsRequest = async (
  type: "sent" | "received",
  page: number = 1,
  limit: number = 10,
): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(`/friends-requests`, {
    params: {
      type,
      page,
      limit,
    },
  });
  return response.data;
};

export const sendFriendRequest = async (userId: string): Promise<void> => {
  await apiClient.post(`/friends-requests`, { friendId: userId });
};

export const acceptFriendRequest = async (userId: string): Promise<void> => {
  await apiClient.post(`/friends-requests/${userId}/accept`);
};

export const declineFriendRequest = async (userId: string): Promise<void> => {
  await apiClient.post(`/friends-requests/${userId}/decline`);
};

export const cancelFriendRequest = async (userId: string): Promise<void> => {
  await apiClient.delete(`/friends-requests/${userId}`);
};

export const removeFriend = async (userId: string): Promise<void> => {
  await apiClient.delete(`/friends/${userId}`);
};
