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
import { useEffect, useMemo, useRef, useState } from "react";
import { MediaSlide } from "./MediaSlide";
import { MediaCounterBadge } from "./MediaCounterBadge";

type Props = {
  medias: MediaPreview[];
  className?: string;
  initialIndex: number;
  open: boolean;
  onIndexChange?: (index: number) => void;
};

const clampIndex = (idx: number, len: number) => {
  const max = Math.max(0, len - 1);
  return Math.max(0, Math.min(idx, max));
};

export function ModalMediaCarousel({
  medias,
  className,
  initialIndex,
  open,
  onIndexChange,
}: Props) {
  if (!medias.length) return null;

  const canNavigate = medias.length > 1;

  const [api, setApi] = useState<CarouselApi>();

  const safeInitial = useMemo(
    () => clampIndex(initialIndex, medias.length),
    [initialIndex, medias.length],
  );

  const [activeIndex, setActiveIndex] = useState(safeInitial);

  const onIndexChangeRef = useRef<typeof onIndexChange>(onIndexChange);
  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      const idx = api.selectedScrollSnap();
      setActiveIndex(idx);
      onIndexChangeRef.current?.(idx);
    };

    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  const appliedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!api) return;

    if (!open) {
      appliedKeyRef.current = null;
      return;
    }

    const key = `${safeInitial}:${medias.length}`;
    if (appliedKeyRef.current === key) return;

    const raf = requestAnimationFrame(() => {
      api.reInit();
      api.scrollTo(safeInitial, true);
      setActiveIndex(safeInitial);
      onIndexChangeRef.current?.(safeInitial);
      appliedKeyRef.current = key;
    });

    return () => cancelAnimationFrame(raf);
  }, [api, open, safeInitial, medias.length]);

  return (
    <div
      className={cn(
        "w-full h-full min-h-0 overflow-hidden touch-pan-y",
        className,
      )}
    >
      <Carousel
        setApi={setApi}
        opts={{ watchDrag: canNavigate, loop: canNavigate }}
        className="relative w-full h-full min-h-0 overflow-hidden"
      >
        <CarouselContent
          containerClassName="h-full min-h-0"
          className={cn("ml-0 h-full min-h-0", "items-stretch")}
        >
          {medias.map((m, index) => (
            <CarouselItem
              key={m.id}
              className={cn(
                "p-0 pl-0",
                "h-full min-h-0",
                "flex items-center justify-center",
              )}
            >
              <MediaSlide
                media={m}
                index={index}
                mode="modal"
                isActive={index === activeIndex}
                isClickable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <MediaCounterBadge activeIndex={activeIndex} total={medias.length} />

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
