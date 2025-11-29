import type { PostMedia } from "@/shared/api/post";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/ui/carousel";
import Image from "@/shared/components/Image";

interface FeedCardMediaProps {
  media: PostMedia[];
}

const FeedCardMedia = ({ media }: FeedCardMediaProps) => {
  const images = media.filter((media) => media.type === "image");

  if (images.length === 0) {
    return null;
  }

  return (
    <Carousel className="w-full">
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
    </Carousel>
  );
};

export default FeedCardMedia;
