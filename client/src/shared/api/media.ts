import { apiClient } from "./apiClient";

export const fetchMedia = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/media/${id}`, {
    responseType: "blob",
  });

  return response.data;
};

export interface UploadMediaResponse {
  id: string;
  fileType: string; //change to enum
  mimeType: string;
  sizeByte: number;
  storageKey: string;
  createdAt: string;
}

export const uploadMedia = async (file: File): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadMediaResponse>(
    "/media",
    formData,
  );

  return response.data;
};
