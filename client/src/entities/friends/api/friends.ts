import { apiClient } from "@/shared/api/apiClient";
import type { UserPreview } from "@/entities/user/model/types";
import type { FriendsStats } from "../model/types";

export const fetchFriends = async (
  userId: string | undefined,
  page: number = 1,
  limit: number = 8,
  query?: string,
): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(`/friends/${userId}`, {
    params: {
      page,
      limit,
      query,
    },
  });
  return response.data;
};

export const fetchFriendsRequest = async (
  type: "sent" | "received",
  page: number = 1,
  limit: number = 10,
  query?: string,
): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(`/friends-requests`, {
    params: {
      type,
      page,
      limit,
      query,
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

export const fetchFriendsStats = async (
  userId: string,
): Promise<FriendsStats> => {
  const response = await apiClient.get<FriendsStats>(
    `/friends/${userId}/stats`,
  );
  return response.data;
};
