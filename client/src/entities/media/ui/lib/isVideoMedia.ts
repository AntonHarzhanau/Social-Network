import type { MediaResponse } from "@/entities/media/model/types";

export function isVideoMedia(m: MediaResponse): boolean {
  const anyM = m as any;

  if (anyM.fileType === "video") return true;

  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(m.url);
}
