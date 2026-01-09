import { apiClient } from "@/shared/api/apiClient";
import type { UserPreview, UserProfile } from "@/entities/user/model/types";
import type { MediaResponse } from "@/entities/media/model/mediaResponseTypes";

export const fetchUsers = async (
  page = 1,
  limit = 10,
  username?: string,
  signal?: AbortSignal,
): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>("/users", {
    params: { page, limit, username: username?.trim() || undefined },
    signal,
  });

  return response.data;
};

export const fetchUserProfile = async (
  userId: string,
): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/users/${userId}/profile`);
  return response.data;
};

export const uploadAvatar = async (
  originalId?: string | null,
  previewId?: string | null,
): Promise<void> => {
  console.log("uploadAvatar called with:", { originalId, previewId });
  await apiClient.post("/users/avatar", {
    originalFileId: originalId,
    previewFileId: previewId,
  });
};

export const fetchUserAvatars = async (
  userId: string,
): Promise<MediaResponse[]> => {
  const response = await apiClient.get<MediaResponse[]>(
    `/users/${userId}/avatars`,
  );
  return response.data;
};

export const updateUserProfile = async (
  profileData: Partial<UserProfile>,
): Promise<void> => {
  await apiClient.put(`/users/profile`, profileData);
};
