import { apiClient } from "./apiClient";

export const fetchMedia = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/media/${id}`, {
    responseType: "blob",
  });

  return response.data;
};
