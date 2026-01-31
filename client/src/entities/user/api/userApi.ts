import { apiClient } from "@/shared/api/apiClient";
import type { MediaPreview } from "@/entities/media/model/types";
import type {
  UserPreview,
  UserProfileResponse,
  UserPrivateProfileDetails,
  PatchProfileSettingsPayload,
  EducationUpsertInput,
  WorkExperienceUpsertInput,
  IdResponse,
  UserPrivacySettings,
} from "@/entities/user/model/types";

// ===== public/users =====
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
  signal?: AbortSignal,
): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>(
    `/users/${userId}/profile`,
    { signal },
  );
  return response.data;
};

export const fetchUserProfileDetails = async (
  userId: string,
  signal?: AbortSignal,
): Promise<UserPrivateProfileDetails> => {
  const response = await apiClient.get<UserPrivateProfileDetails>(
    `/users/${userId}/profile/details`,
    { signal },
  );
  return response.data;
};

export const fetchUserAvatars = async (
  userId: string,
  signal?: AbortSignal,
): Promise<MediaPreview[]> => {
  const response = await apiClient.get<MediaPreview[]>(
    `/users/${userId}/avatars`,
    { signal },
  );
  return response.data;
};

export const fetchUserMedias = async (
  userId: string,
  type: "image" | "video",
  signal?: AbortSignal,
): Promise<MediaPreview[]> => {
  const response = await apiClient.get<MediaPreview[]>(
    `/users/${userId}/media`,
    { params: { type }, signal },
  );
  return response.data;
};

// ===== me/profile =====

export const deleteProfile = async (): Promise<void> => {
  await apiClient.delete("/me");
};

export const uploadAvatar = async (
  originalId?: string | null,
  previewId?: string | null,
): Promise<void> => {
  await apiClient.post("/me/avatar", {
    originalFileId: originalId ?? null,
    previewFileId: previewId ?? null,
  });
};

export const uploadCover = async (imageId?: string | null): Promise<void> => {
  await apiClient.post("/me/cover", {
    imageId: imageId ?? null,
  });
};

export const attachMyMedia = async (mediaIds: string[]): Promise<unknown> => {
  const response = await apiClient.post("/me/media", { mediaIds });
  return response.data;
};

export const fetchPrivateProfileSettings = async (
  signal?: AbortSignal,
): Promise<UserPrivacySettings> => {
  const response = await apiClient.get<UserPrivacySettings>(
    "/me/profile/privacy",
    { signal },
  );
  return response.data;
};

export const patchMyProfileSettings = async (
  payload: PatchProfileSettingsPayload,
): Promise<void> => {
  await apiClient.patch("/me/profile", payload);
};

export const addEducation = async (
  input: EducationUpsertInput,
): Promise<IdResponse> => {
  const response = await apiClient.post<IdResponse>(
    "/me/profile/education",
    input,
  );
  return response.data;
};

export const updateEducation = async (
  educationId: string,
  input: EducationUpsertInput,
): Promise<IdResponse> => {
  const response = await apiClient.put<IdResponse>(
    `/me/profile/education/${educationId}`,
    input,
  );
  return response.data;
};

export const deleteEducation = async (educationId: string): Promise<void> => {
  await apiClient.delete(`/me/profile/education/${educationId}`);
};

export const addWorkExperience = async (
  input: WorkExperienceUpsertInput,
): Promise<IdResponse> => {
  const response = await apiClient.post<IdResponse>(
    "/me/profile/work-experience",
    input,
  );
  return response.data;
};

export const updateWorkExperience = async (
  workExperienceId: string,
  input: WorkExperienceUpsertInput,
): Promise<IdResponse> => {
  const response = await apiClient.put<IdResponse>(
    `/me/profile/work-experience/${workExperienceId}`,
    input,
  );
  return response.data;
};

export const deleteWorkExperience = async (
  workExperienceId: string,
): Promise<void> => {
  await apiClient.delete(`/me/profile/work-experience/${workExperienceId}`);
};
