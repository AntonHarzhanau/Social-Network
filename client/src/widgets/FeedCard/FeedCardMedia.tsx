import type { PostMedia } from "@/shared/api/post";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import Image from "@/shared/components/Image";
import { useState } from "react";

interface FeedCardMediaProps {
  media: PostMedia[];
}

const FeedCardMedia = ({ media }: FeedCardMediaProps) => {
  const images = media.filter((media) => media.type === "image");
  const [_, setApi] = useState<CarouselApi>();
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (images.length === 0) {
    return null;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        watchDrag: isTouch && images.length > 1,
      }}
      className="w-full"
    >
      <CarouselContent className="rounded-none gap-1">
        {images.map((media) => (
          <CarouselItem key={media.id} className="p-0 rounded-none">
            <AspectRatio
              ratio={4 / 5}
              className="flex justify-center items-center bg-muted"
            >
              <Image mediaId={media.id} alt="Post Image" className="" />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious variant="secondary" className="left-4" />
          <CarouselNext variant="secondary" className="right-4" />
        </>
      )}
    </Carousel>
  );
};

export default FeedCardMedia;
