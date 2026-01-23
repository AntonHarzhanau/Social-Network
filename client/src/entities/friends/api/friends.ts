import { apiClient } from "@/shared/api/apiClient";
import type { UserPreview } from "@/entities/user/model/types";
import type { MyFriendsStats, PublicFriendsStats } from "../model/types";

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

export const fetchPublicFriendsStats = async (
  userId: string,
): Promise<PublicFriendsStats> => {
  const response = await apiClient.get<PublicFriendsStats>(
    `/friends/${userId}/stats`,
  );
  return response.data;
};

export const fetchMyFriendsStats = async (): Promise<MyFriendsStats> => {
  const response = await apiClient.get<MyFriendsStats>(`/friends/me/stats`);
  return response.data;
};
