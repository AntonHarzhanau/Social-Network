// entities/media/ui/MediaCarousel/hooks/useCarouselActiveIndex.ts
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/shared/components/ui/carousel";

export function useCarouselActiveIndex(
  api: CarouselApi | undefined,
  onIndexChange?: (index: number) => void,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setActiveIndex(idx);
      onIndexChange?.(idx);
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onIndexChange]);

  return activeIndex;
}
