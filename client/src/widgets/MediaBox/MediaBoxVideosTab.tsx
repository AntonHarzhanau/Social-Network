import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

import type { MediaBoxSource } from "./model/types";
import { mediaBoxKeys } from "./model/keys";
import { UploadOwnerMediaDialog } from "@/features/media/upload-media/ui/UploadOwnerMediaDialog";
import type { MediaPreview } from "@/entities/media/model/types";

const VideoThumb = ({
  src,
  onClick,
}: {
  src: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full aspect-video rounded-2xl overflow-clip bg-muted"
    >
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
      />
    </button>
  );
};

export const MediaBoxVideosTab = ({
  source,
  labelUpload = "Load videos",
  labelAll = "All videos",
}: {
  source: MediaBoxSource;
  labelUpload?: string;
  labelAll?: string;
}) => {
  const q = useQuery({
    queryKey: mediaBoxKeys.list(source.owner, "video"),
    queryFn: ({ signal }) => source.fetchMedias("video", signal),
    enabled: source.canView,
    staleTime: 60_000,
  });

  if (q.isPending) return <Skeleton className="min-h-60 w-full" />;
  if (q.isError) return null;

  const medias = q.data ?? [];

  const onOpen = (idx: number) => {
    if (!source.onOpenViewer) return;
    source.onOpenViewer({
      type: "video",
      medias,
      initialIndex: idx,
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Carousel className="w-full max-w-md">
        <CarouselContent className="-ml-1">
          {medias.map((m: MediaPreview, index: number) => (
            <CarouselItem key={m.id} className="pl-1 md:basis-1/2 lg:basis-2/3">
              <div className="p-1">
                <Card className="p-0 gap-1 border-none">
                  <CardContent className="p-0">
                    <VideoThumb src={m.url} onClick={() => onOpen(index)} />
                  </CardContent>

                  <CardDescription className="px-1 py-2">
                    <div className="flex flex-col">
                      <Button
                        type="button"
                        variant="link"
                        className="text-lg font-semibold px-0 h-auto justify-start"
                        onClick={() => onOpen(index)}
                      >
                        Video
                      </Button>

                      <div className="text-sm text-muted-foreground">—</div>

                      <div className="flex gap-1 text-xs text-muted-foreground mt-1">
                        <p>{/* 200 watches */}</p>
                        <p>{/* · */}</p>
                        <p>{/* 2 hours ago */}</p>
                      </div>
                    </div>
                  </CardDescription>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious variant="secondary" className="left-4" />
        <CarouselNext variant="secondary" className="right-4" />
      </Carousel>

      <div className="mt-2 flex gap-4 w-full px-2 pb-2">
        {source.canUpload && source.attachMedias ? (
          <UploadOwnerMediaDialog
            label={labelUpload}
            accept="video"
            multiple={true}
            owner={source.owner}
            attachMedias={source.attachMedias}
            afterAttachInvalidate={source.afterAttachInvalidate}
          />
        ) : null}

        <Button className="flex-1" onClick={() => source.onShowAll?.("video")}>
          {labelAll}
        </Button>
      </div>
    </div>
  );
};
