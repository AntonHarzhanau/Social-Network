export type FileType = "image" | "video" | "audio" | "document" | "other";

export interface MediaResponse {
  id: string;
  fileType: FileType;
  url: string;
  createdAt: string;
}
