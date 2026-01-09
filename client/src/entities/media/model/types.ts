export type MediaAsset = {
  id: string;
  url: string;
  mimeType?: string | null;
  type?: "image" | "video"; // опционально
};
