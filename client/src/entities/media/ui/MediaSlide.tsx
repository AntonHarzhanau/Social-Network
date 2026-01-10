import { cn } from "@/shared/lib/utils";
import type { MediaResponse } from "@/entities/media/model/types";
import { computeTargetSize } from "@/entities/media/ui/lib/size";
import { isVideoMedia } from "./lib/isVideoMedia";
import { useEffect, useRef } from "react";

type Dims = { w: number; h: number } | null;

type Props = {
  media: MediaResponse;
  index: number;
  layout: "feed" | "modal";
  containerW: number;
  containerH: number;
  dims: Dims;

  isClickable: boolean;
  onClick?: (item: MediaResponse, index: number) => void;

  onImgNaturalLoad?: (id: string, w: number, h: number) => void;

  isActive?: boolean;
};

export function MediaSlide({
  media,
  index,
  layout,
  containerW,
  containerH,
  dims,
  isClickable,
  onClick,
  onImgNaturalLoad,
  isActive = true,
}: Props) {
  const video = isVideoMedia(media);

  const target =
    layout === "modal" && dims
      ? computeTargetSize({
          layout: "modal",
          containerW,
          containerH,
          mediaW: dims.w,
          mediaH: dims.h,
        })
      : null;

  const handleClick = () => onClick?.(media, index);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!video) return;
    if (!videoRef.current) return;
    if (isActive) return;

    videoRef.current.pause();
    //  сбрасывать на начало :
    // videoRef.current.currentTime = 0;
  }, [isActive, video]);

  const commonClass = cn(
    "select-none object-contain",
    layout === "feed"
      ? "w-full h-full"
      : "block max-w-full max-h-full",
  );

  const commonStyle =
    layout === "modal" && target
      ? { width: `${target.width}px`, height: `${target.height}px` }
      : undefined;

  return (
    <div
      className={cn(
        "w-full h-full overflow-hidden flex items-center justify-center",
        isClickable && "cursor-pointer",
      )}
      onClick={isClickable ? handleClick : undefined}
    >
      {video ? (
        <video
          ref={videoRef}
          src={media.url}
          preload="metadata"
          playsInline
          controls={layout === "modal"}
          muted={layout !== "modal"}
          onLoadedMetadata={(e) => {
            if ((media.width ?? 0) > 0 && (media.height ?? 0) > 0) return;

            const v = e.currentTarget;
            onImgNaturalLoad?.(media.id, v.videoWidth, v.videoHeight);
          }}
          style={commonStyle}
          className={commonClass}
        />
      ) : (
        <img
          src={media.url}
          alt=""
          loading="lazy"
          draggable={false}
          onLoad={(e) => {
            if ((media.width ?? 0) > 0 && (media.height ?? 0) > 0) return;

            const img = e.currentTarget;
            onImgNaturalLoad?.(media.id, img.naturalWidth, img.naturalHeight);
          }}
          style={commonStyle}
          className={commonClass}
        />
      )}
    </div>
  );
}
