import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import { cn } from "@/shared/lib/utils";
import type { MediaPreview } from "@/entities/media/model/types";
import { useEffect, useMemo, useState } from "react";
import { useNaturalSizeMap } from "./hooks/useNaturalSizeMap";
import { MediaSlide } from "./MediaSlide";
import { MediaCounterBadge } from "./MediaCounterBadge";

const FALLBACK_RATIO = 4 / 5;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

function getRatio(
  media: MediaPreview | undefined,
  naturalById: Record<string, { w: number; h: number }>,
) {
  if (!media) return FALLBACK_RATIO;

  const mw = media.width ?? 0;
  const mh = media.height ?? 0;
  if (mw > 0 && mh > 0) return mw / mh;

  const nat = naturalById[media.id];
  if (nat?.w && nat?.h) return nat.w / nat.h;

  return FALLBACK_RATIO;
}

type Props = {
  medias: MediaPreview[] | null;
  className?: string;
  onItemClick?: (item: MediaPreview, index: number) => void;
};

export function FeedMediaCarousel({ medias, className, onItemClick }: Props) {
  const safeMedias = medias ?? [];
  if (safeMedias.length === 0) return null;

  const canNavigate = safeMedias.length > 1;

  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const { naturalById, registerNaturalSize } = useNaturalSizeMap();

  useEffect(() => {
    if (!api) return;

    const update = () => setActiveIndex(api.selectedScrollSnap());
    update();

    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  const ratio = useMemo(() => {
    const r = getRatio(safeMedias[activeIndex] ?? safeMedias[0], naturalById);
    return clamp(r, 0.6, 2.2);
  }, [safeMedias, activeIndex, naturalById]);

  const isClickable = typeof onItemClick === "function";

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
    >
      <Carousel
        setApi={setApi}
        opts={{ watchDrag: canNavigate, loop: canNavigate }}
        className="relative w-full h-full overflow-hidden"
      >
        <CarouselContent className="w-full h-full ml-0">
          {safeMedias.map((m, index) => (
            <CarouselItem key={m.id} className="w-full h-full basis-full p-0">
              <MediaSlide
                media={m}
                index={index}
                mode="feed"
                isActive={index === activeIndex}
                isClickable={isClickable}
                onClick={onItemClick}
                onNaturalLoad={registerNaturalSize}
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
