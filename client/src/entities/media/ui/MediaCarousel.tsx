import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { MediaPreview } from "@/entities/media/model/types";

import { useElementSize } from "./hooks/useElementSize";
import { useNaturalSizeMap } from "./hooks/useNaturalSizeMap";
import { useCarouselActiveIndex } from "./hooks/useCarouselActiveIndex";
import { useFeedHeight } from "./hooks/useFeedHeight";
import { MediaSlide } from "./MediaSlide";
import { MediaCounterBadge } from "./MediaCounterBadge";

interface MediaCarouselProps {
  medias: MediaPreview[] | null;
  className?: string;

  layout?: "feed" | "modal";
  initialIndex?: number;

  onIndexChange?: (index: number) => void;
  onItemClick?: (item: MediaPreview, index: number) => void;
}

type Dims = { w: number; h: number } | null;

export default function MediaCarousel({
  medias,
  className,
  layout = "feed",
  initialIndex,
  onIndexChange,
  onItemClick,
}: MediaCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

  const { naturalById, registerNaturalSize } = useNaturalSizeMap();

  const isClickable = typeof onItemClick === "function";

  const safeMedias = medias ?? [];
  if (safeMedias.length === 0) return null;

  const canNavigate = safeMedias.length > 1;

  const getDims = useCallback(
    (m: MediaPreview): Dims => {
      const mw = m.width ?? 0;
      const mh = m.height ?? 0;
      if (mw > 0 && mh > 0) return { w: mw, h: mh };

      const nat = naturalById[m.id];
      if (nat?.w && nat?.h) return nat;

      return null;
    },
    [naturalById],
  );

  const activeIndex = useCarouselActiveIndex(api, onIndexChange);

  // initial scroll
  useEffect(() => {
    if (!api) return;
    if (initialIndex === undefined || initialIndex === null) return;

    const max = safeMedias.length - 1;
    const safe = Math.max(0, Math.min(initialIndex, max));
    api.scrollTo(safe, true);
  }, [api, initialIndex, safeMedias.length]);

  const feedHeightPx = useFeedHeight({
    layout,
    containerW: size.width,
    medias: safeMedias,
    activeIndex,
    getDims,
  });

  const onImgNaturalLoad = useCallback(
    (id: string, w: number, h: number) => registerNaturalSize(id, w, h),
    [registerNaturalSize],
  );

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden", className)}
      style={
        layout === "feed"
          ? { height: feedHeightPx ? `${feedHeightPx}px` : undefined }
          : { height: "100%" }
      }
    >
      <Carousel
        setApi={setApi}
        opts={{
          watchDrag: canNavigate,
          loop: canNavigate,
        }}
        className="relative w-full h-full overflow-hidden"
      >
        <CarouselContent className="w-full h-full ml-0">
          {safeMedias.map((mediaItem, index) => (
            <CarouselItem
              key={mediaItem.id}
              className="w-full h-full basis-full p-0 pl-0"
            >
              <MediaSlide
                media={mediaItem}
                index={index}
                layout={layout}
                containerW={size.width}
                containerH={size.height}
                dims={getDims(mediaItem)}
                isClickable={isClickable}
                onClick={onItemClick}
                onImgNaturalLoad={onImgNaturalLoad}
                isActive={index === activeIndex}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <MediaCounterBadge
          activeIndex={activeIndex}
          total={safeMedias.length}
        />

        {canNavigate && (
          <>
            <CarouselPrevious variant="secondary" className="left-4" />
            <CarouselNext variant="secondary" className="right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
}
