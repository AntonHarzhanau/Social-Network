// entities/media/ui/MediaCarousel/lib/size.ts
import type { MediaPreview } from "@/entities/media/model/types";

export const FALLBACK_RATIO = 4 / 5;

export function getRatioFromMeta(m: MediaPreview, fallbackRatio: number) {
  const w = m.width ?? 0;
  const h = m.height ?? 0;
  if (w > 0 && h > 0) return w / h;
  return fallbackRatio;
}

export function computeTargetSize(params: {
  layout: "feed" | "modal";
  containerW: number;
  containerH: number;
  mediaW: number;
  mediaH: number;
}) {
  const { layout, containerW, containerH, mediaW, mediaH } = params;

  if (
    !containerW ||
    (layout === "modal" && !containerH) ||
    !mediaW ||
    !mediaH
  ) {
    return null;
  }

  if (layout === "modal") {
    const scaleH = containerH / mediaH;
    const wByH = mediaW * scaleH;
    if (wByH <= containerW) {
      return { width: Math.round(wByH), height: Math.round(containerH) };
    }

    const scaleW = containerW / mediaW;
    const hByW = mediaH * scaleW;
    return { width: Math.round(containerW), height: Math.round(hByW) };
  }

  // feed: fit width
  const scaleW = containerW / mediaW;
  const h = mediaH * scaleW;
  return { width: Math.round(containerW), height: Math.round(h) };
}
