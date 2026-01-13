import { useMemo } from "react";
import type { MediaPreview } from "@/entities/media/model/types";
import { computeTargetSize, FALLBACK_RATIO, getRatioFromMeta } from "../lib/size";

type Dims = { w: number; h: number } | null;

export function useFeedHeight(params: {
  layout: "feed" | "modal";
  containerW: number;
  medias: MediaPreview[];
  activeIndex: number;
  getDims: (m: MediaPreview) => Dims;
}) {
  const { layout, containerW, medias, activeIndex, getDims } = params;

  return useMemo(() => {
    if (layout !== "feed") return undefined;
    if (!containerW) return undefined;

    const item = medias[activeIndex] ?? medias[0];
    const dims = item ? getDims(item) : null;

    if (dims) {
      const target = computeTargetSize({
        layout: "feed",
        containerW,
        containerH: 0,
        mediaW: dims.w,
        mediaH: dims.h,
      });
      return target?.height;
    }

    const r = item ? getRatioFromMeta(item, FALLBACK_RATIO) : FALLBACK_RATIO;
    return Math.round(containerW / r);
  }, [layout, containerW, medias, activeIndex, getDims]);
}
