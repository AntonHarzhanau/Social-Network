import type { MediaResponse } from "../types/mediaResponseTypes";
import { apiClient } from "./apiClient";

export const fetchMedia = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/media/${id}`, {
    responseType: "blob",
  });

  return response.data;
};

export const uploadMedia = async (file: File): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<MediaResponse>(
    "/media",
    formData,
  );

  return response.data;
};
