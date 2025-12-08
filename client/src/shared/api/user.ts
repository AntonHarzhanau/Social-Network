import { apiClient } from "./apiClient";
import type { Me } from "./auth";

export const fetchUsers = async (): Promise<Me[]> => {
  const response = await apiClient.get<Me[]>("/user");

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
  const response = await apiClient.get<UserProfile>(`/user/${userId}/profile`);
  return response.data;
};
