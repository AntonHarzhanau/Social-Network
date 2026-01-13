import type { MediaDetail, MediaPreview, ToggleLikeMediaResponse } from "@/entities/media/model/types";
import { apiClient } from "@/shared/api/apiClient";

export const fetchMedia = async (id: string): Promise<MediaDetail> => {
  const response = await apiClient.get(`/media/${id}`);

  return response.data;
};

export const fetchMedias = async (): Promise<MediaPreview[]> => {
  const response = await apiClient.get<MediaPreview[]>(`/media`);

  return response.data;
};

export const uploadMedia = async (file: File): Promise<MediaPreview> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<MediaPreview>("/media", formData);
  return response.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
}

export const toggleLikeMedia = async (id: string): Promise<ToggleLikeMediaResponse> => {
    const response = await apiClient.post<ToggleLikeMediaResponse>(`/media/${id}/like`);
    return response.data;
}
