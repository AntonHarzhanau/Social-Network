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
import { useState } from "react";

interface FeedCardMediaProps {
  media: MediaResponse[];
}

const FeedCardMedia = ({ media }: FeedCardMediaProps) => {
  const [_, setApi] = useState<CarouselApi>();
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  if (media.length === 0) {
    return null;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        watchDrag: isTouch && media.length > 1,
      }}
      className="w-full"
    >
      <CarouselContent className="rounded-none gap-1">
        {media.map((media) => (
          <CarouselItem key={media.id} className="p-0 rounded-none">
            <AspectRatio
              ratio={4 / 5}
              className="flex bg-muted"
            >
              <img src={media.url} alt="" className="object-cover"/>
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      {media.length > 1 && (
        <>
          <CarouselPrevious variant="secondary" className="left-4" />
          <CarouselNext variant="secondary" className="right-4" />
        </>
      )}
    </Carousel>
  );
};

export default FeedCardMedia;
