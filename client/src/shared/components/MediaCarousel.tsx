import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import type { MediaResponse } from "@/shared/types/mediaResponseTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";

interface FeedCardMediaProps {
  medias: MediaResponse[] | null;
  className?: string;
}

const FALLBACK_ASPECT_RATIO = 4 / 5;

function isVideoMedia(mediaItem: MediaResponse): boolean {
  const mediaAny = mediaItem as any;

  if (mediaAny.type === "video") return true;
  if (
    typeof mediaAny.mimeType === "string" &&
    mediaAny.mimeType.startsWith("video/")
  )
    return true;

  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(mediaItem.url);
}

export default function MediaCarousel({
  medias,
  className,
}: FeedCardMediaProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [aspectRatioByMediaId, setAspectRatioByMediaId] = useState<
    Record<string, number>
  >({});
  const videoElementByMediaIdRef = useRef<
    Record<string, HTMLVideoElement | null>
  >({});

  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const stopAllVideos = useCallback(() => {
    Object.values(videoElementByMediaIdRef.current).forEach((videoEl) => {
      if (!videoEl) return;
      videoEl.pause();
      videoEl.currentTime = 0;
    });
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSlideChange = () => stopAllVideos();
    carouselApi.on("select", handleSlideChange);

    return () => {
      carouselApi.off("select", handleSlideChange);
    };
  }, [carouselApi, stopAllVideos]);

  const updateAspectRatio = useCallback(
    (mediaId: string, width: number, height: number) => {
      if (!width || !height) return;

      const computedRatio = width / height;

      setAspectRatioByMediaId((current) => {
        const previousRatio = current[mediaId];
        if (previousRatio && Math.abs(previousRatio - computedRatio) < 0.002)
          return current;

        return { ...current, [mediaId]: computedRatio };
      });
    },
    [],
  );

  const mediaItems = medias;
  if (!mediaItems || mediaItems.length === 0) return null;

  const canNavigate = mediaItems.length > 1;

  return (
    <Carousel
      setApi={setCarouselApi}
      opts={{
        watchDrag: isTouchDevice && canNavigate,
        loop: canNavigate,
      }}
      className={cn("w-full h-fit", className)}
    >
      <CarouselContent className="rounded-none gap-1">
        {mediaItems.map((mediaItem) => {
          const isVideo = isVideoMedia(mediaItem);
          const aspectRatio =
            aspectRatioByMediaId[mediaItem.id] ?? FALLBACK_ASPECT_RATIO;

          return (
            <CarouselItem
              key={mediaItem.id}
              className="flex justify-center items-center p-0 rounded-none "
            >
              <AspectRatio
                ratio={aspectRatio}
                className="flex bg-muted overflow-hidden"
              >
                {isVideo ? (
                  <video
                    ref={(videoEl) => {
                      videoElementByMediaIdRef.current[mediaItem.id] = videoEl;
                    }}
                    className="w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      const videoEl = e.currentTarget;
                      updateAspectRatio(
                        mediaItem.id,
                        videoEl.videoWidth,
                        videoEl.videoHeight,
                      );
                    }}
                  >
                    <source src={mediaItem.url} />
                  </video>
                ) : (
                  <img
                    src={mediaItem.url}
                    alt=""
                    className="w-full object-contain"
                    loading="lazy"
                    draggable={false}
                    onLoad={(e) => {
                      const imgEl = e.currentTarget;
                      updateAspectRatio(
                        mediaItem.id,
                        imgEl.naturalWidth,
                        imgEl.naturalHeight,
                      );
                    }}
                  />
                )}
              </AspectRatio>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {canNavigate && (
        <>
          <CarouselPrevious variant="secondary" className="left-4" />
          <CarouselNext variant="secondary" className="right-4" />
        </>
      )}
    </Carousel>
  );
}
