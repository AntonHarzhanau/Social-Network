import { cn } from "@/shared/lib/utils";
import type { MediaPreview } from "@/entities/media/model/types";
import { isVideoMedia } from "./lib/isVideoMedia";
import { useEffect, useRef } from "react";

type Props = {
  media: MediaPreview;
  index: number;
  mode: "feed" | "modal";

  isClickable: boolean;
  onClick?: (item: MediaPreview, index: number) => void;

  onNaturalLoad?: (id: string, w: number, h: number) => void;

  isActive?: boolean;
};

export function MediaSlide({
  media,
  index,
  mode,
  isClickable,
  onClick,
  onNaturalLoad,
  isActive = true,
}: Props) {
  const video = isVideoMedia(media);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!video) return;
    if (!videoRef.current) return;
    if (isActive) return;
    videoRef.current.pause();
  }, [isActive, video]);

  const handleClick = () => onClick?.(media, index);

  const mediaClass =
    mode === "modal"
      ? "block max-w-full max-h-full w-auto h-auto object-contain select-none"
      : "block w-full h-full object-contain select-none";

  return (
    <div
      className={cn(
        "w-full h-full min-h-0 min-w-0 overflow-hidden",
        "flex items-center justify-center",
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
          controls={mode === "modal"}
          muted={mode !== "modal"}
          className={mediaClass}
          onLoadedMetadata={(e) => {
            if ((media.width ?? 0) > 0 && (media.height ?? 0) > 0) return;
            const v = e.currentTarget;
            onNaturalLoad?.(media.id, v.videoWidth, v.videoHeight);
          }}
        />
      ) : (
        <img
          src={media.url}
          alt=""
          loading="lazy"
          draggable={false}
          className={mediaClass}
          onLoad={(e) => {
            if ((media.width ?? 0) > 0 && (media.height ?? 0) > 0) return;
            const img = e.currentTarget;
            onNaturalLoad?.(media.id, img.naturalWidth, img.naturalHeight);
          }}
        />
      )}
    </div>
  );
}
