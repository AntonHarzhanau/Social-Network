import type { MediaResponse } from "../model/mediaResponseTypes";
import { apiClient } from "../../../shared/api/apiClient";

export const fetchMedia = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/media/${id}`, {
    responseType: "blob",
  });

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


export type MediaAssetComment = {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export type MediaAssetReactions = {
  likeCount: number;
  isLikedByCurrentUser: boolean;
  comments: MediaAssetComment[];
};

// заглушка (позже заменишь на реальный fetch)
export async function fetchMediaAssetReactions(mediaId: string): Promise<MediaAssetReactions> {
  // имитация сети
  await new Promise((r) => setTimeout(r, 250));

  const n = hashToInt(mediaId);
  const likeCount = (n % 97) + 1;
  const commentsCount = n % 5;

  return {
    likeCount,
    isLikedByCurrentUser: n % 2 === 0,
    comments: Array.from({ length: commentsCount }).map((_, i) => ({
      id: `${mediaId}-c${i}`,
      authorName: `User ${((n + i) % 10) + 1}`,
      text: `Комментарий #${i + 1} к media ${mediaId.slice(0, 6)}...`,
      createdAt: new Date(Date.now() - (i + 1) * 60_000).toISOString(),
    })),
  };
}

function hashToInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
