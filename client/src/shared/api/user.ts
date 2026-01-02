import { apiClient } from "./apiClient";
import type { Me } from "./auth";

export const fetchUsers = async (): Promise<Me[]> => {
  const response = await apiClient.get<Me[]>("/users");

  return response.data;
};

export interface UserProfile extends Me {
  coverUrl: string;
  location: string;
  bio: string;
  maritalStatus: string;
  dateOfBirth: string;
}

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

