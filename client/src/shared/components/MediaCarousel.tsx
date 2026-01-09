import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import type { MediaResponse } from "@/entities/media/model/mediaResponseTypes";

interface MediaCarouselProps {
  medias: MediaResponse[] | null;
  className?: string;

  layout?: "feed" | "modal";
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  onItemClick?: (item: MediaResponse, index: number) => void;
}

const FALLBACK_RATIO = 4 / 5;

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

function getRatioFromMeta(m: MediaResponse, fallbackRatio: number) {
  const w = m.width ?? 0;
  const h = m.height ?? 0;
  if (w > 0 && h > 0) return w / h;
  return fallbackRatio;
}

/**
 * layout=modal:
 *  - ПРИОРИТЕТ: заполнить высоту (h = containerH), w = mediaW * scale
 *  - если w > containerW: переключаемся на fit по ширине, чтобы не обрезать
 *
 * layout=feed:
 *  - заполнить ширину (w = containerW), h = mediaH * scale
 */
function computeTargetSize(params: {
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
    // safe: если по высоте ширина вылезает — считаем по ширине
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

export default function MediaCarousel({
  medias,
  className,
  layout = "feed",
  initialIndex,
  onItemClick,
}: MediaCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

  // если meta width/height иногда нет — добираем из onLoad
  const [naturalById, setNaturalById] = useState<
    Record<string, { w: number; h: number }>
  >({});

  if (!medias || medias.length === 0) return null;

  const canNavigate = medias.length > 1;
  const isClickable = typeof onItemClick === "function";

  // initial scroll
  useEffect(() => {
    if (!api) return;
    if (initialIndex === undefined || initialIndex === null) return;

    const max = medias.length - 1;
    const safe = Math.max(0, Math.min(initialIndex, max));
    api.scrollTo(safe, true);
    setActiveIndex(safe);
  }, [api, initialIndex, medias.length]);

  // active index tracking (for feed height)
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // helper: dims per item
  const getDims = (m: MediaResponse) => {
    const mw = m.width ?? 0;
    const mh = m.height ?? 0;
    if (mw > 0 && mh > 0) return { w: mw, h: mh };

    const nat = naturalById[m.id];
    if (nat?.w && nat?.h) return nat;

    return null;
  };

  // FEED: задаём высоту контейнера от активного слайда (чтобы не было 0px)
  // Если хочешь, чтобы высота НЕ менялась при свайпе — можно брать medias[0] вместо activeIndex.
  const feedHeightPx = useMemo(() => {
    if (layout !== "feed") return undefined;
    const containerW = size.width;
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

    // fallback по ratio (если размеров пока нет)
    const r = item ? getRatioFromMeta(item, FALLBACK_RATIO) : FALLBACK_RATIO;
    return Math.round(containerW / r);
  }, [layout, size.width, medias, activeIndex, naturalById]);

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
          {medias.map((mediaItem, index) => {
            const handleClick = () => onItemClick?.(mediaItem, index);

            const dims = getDims(mediaItem);
            const target =
              layout === "modal" && dims
                ? computeTargetSize({
                    layout: "modal",
                    containerW: size.width,
                    containerH: size.height,
                    mediaW: dims.w,
                    mediaH: dims.h,
                  })
                : null;

            return (
              <CarouselItem
                key={mediaItem.id}
                className="w-full h-full basis-full p-0 pl-0"
              >
                <div
                  className={cn(
                    "w-full h-full overflow-hidden flex items-center justify-center",
                    isClickable && "cursor-pointer",
                  )}
                  onClick={isClickable ? handleClick : undefined}
                >
                  <img
                    src={mediaItem.url}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    onLoad={(e) => {
                      // если meta нет — сохраняем natural
                      if (
                        (mediaItem.width ?? 0) > 0 &&
                        (mediaItem.height ?? 0) > 0
                      )
                        return;

                      const img = e.currentTarget;
                      const w = img.naturalWidth;
                      const h = img.naturalHeight;
                      if (!w || !h) return;

                      setNaturalById((cur) =>
                        cur[mediaItem.id]
                          ? cur
                          : { ...cur, [mediaItem.id]: { w, h } },
                      );
                    }}
                    style={
                      layout === "modal" && target
                        ? {
                            width: `${target.width}px`,
                            height: `${target.height}px`,
                          }
                        : undefined
                    }
                    className={cn(
                      "select-none object-contain",
                      layout === "feed"
                        ? "w-full h-full" // ВАЖНО: feed — только так
                        : "block max-w-none max-h-none", // modal — размеры задаём стилем
                    )}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {medias.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 right-2 z-20 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            {activeIndex + 1}/{medias.length}
          </div>
        )}
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
