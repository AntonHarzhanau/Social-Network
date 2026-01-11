import type { MediaResponse, ToggleLikeMediaResponse } from "@/entities/media/model/types";
import { apiClient } from "@/shared/api/apiClient";

export const fetchMedia = async (id: string): Promise<MediaResponse> => {
  const response = await apiClient.get(`/media/${id}`);

  return response.data;
};

export const fetchMedias = async (): Promise<MediaResponse[]> => {
  const response = await apiClient.get<MediaResponse[]>(`/media`);

  return response.data;
};

export const uploadMedia = async (file: File): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<MediaResponse>("/media", formData);

  return response.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
}

export const toggleLikeMedia = async (id: string): Promise<ToggleLikeMediaResponse> => {
    const response = await apiClient.post<ToggleLikeMediaResponse>(`/media/${id}/like`);
    return response.data;
}
