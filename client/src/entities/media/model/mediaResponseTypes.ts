export type FileType = "image" | "video" | "audio" | "document" | "other";

export interface MediaResponse {
  id: string;
  fileType: FileType;
  url: string;
  createdAt: string;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
}
