import { apiClient } from "@/shared/api/apiClient";
import type { UserPreview, UserProfile } from "@/entities/user/model/types";


export const fetchUsers = async (): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>("/users");

  return response.data;
};

export const fetchUserProfile = async (
  userId: string,
): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/users/${userId}/profile`);
  return response.data;
};

export const uploadAvatar = async (
    originalId: string,
    previewId: string,
  ): Promise<void> => {
    console.log("uploadAvatar called with:", { originalId, previewId });
    await apiClient.post("/users/avatar", {
        originalFileId: originalId,
        previewFileId: previewId,
    })
  };

