export type MediaAsset = {
  id: string;
  url: string;
  mimeType?: string | null;
  type?: "image" | "video";
};

export type FileType = "image" | "video" | "audio" | "document" | "other";

export interface MediaPreview {
  id: string;
  url: string;
  type: FileType;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
}
export interface MediaDetail extends MediaPreview {
  createdAt: string;
  commentThreadId: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

export const UPLOADING_STATUS = {
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type UPLOADING_STATUS =
  (typeof UPLOADING_STATUS)[keyof typeof UPLOADING_STATUS];

export type MediaItem = {
  localId: string;
  file: File;
  status: UPLOADING_STATUS;
  serverId?: string;
  previewUrl?: string;
  error?: string;
};

export type ToggleLikeMediaResponse = {
  id: string;
  likedByCurrentUser: boolean;
  likeCount: number;
};
