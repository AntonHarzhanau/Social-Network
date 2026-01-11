import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import MediaCarousel from "@/entities/media/ui/MediaCarousel";
import { cn } from "@/shared/lib/utils";
import type { MediaResponse } from "@/entities/media/model/types";
import MediaModalCloseButton from "./MediaModalCloseButton";
import MediaModalControls from "./MediaModalControls";
import MediaModalAside from "./MediaModalAside";

import { fetchMedia, toggleLikeMedia } from "@/entities/media/api/mediaApi";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const MEDIA_QUERY_KEY = "media";

export type MediaModalAuthor = {
  id: string;
  username: string;
  avatarUrl?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  author: MediaModalAuthor;
  medias: MediaResponse[];
  initialIndex: number;
};

export function MediaModal({
  open,
  author,
  onOpenChange,
  medias,
  initialIndex,
}: Props) {
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // чтобы при повторном открытии модалки индекс сбрасывался
  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  const mediaId = medias[currentIndex]?.id;

  const {
    data: currentMedia,
    isFetching: isMediaFetching,
  } = useQuery<MediaResponse>({
    queryKey: [MEDIA_QUERY_KEY, mediaId],
    queryFn: () => fetchMedia(mediaId!),
    enabled: !!mediaId,
    placeholderData: keepPreviousData, // чтобы не мигало при перелистывании
  });

  const toggleLike = useMutation({
    mutationFn: () => toggleLikeMedia(mediaId!),
    onSuccess: async () => {
      // рефетчим ТОЛЬКО текущее медиа
      await queryClient.invalidateQueries({
        queryKey: [MEDIA_QUERY_KEY, mediaId],
        exact: true,
      });

      // при желании можно ещё инвалидировать посты, но ты просил только медиа
      // await queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
    },
  });

  // fallback, чтобы не падать в undefined до первой загрузки
  const mediaForRender = useMemo(() => {
    return currentMedia ?? medias[currentIndex];
  }, [currentMedia, medias, currentIndex]);

  if (!mediaForRender) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "p-0 max-w-none min-w-[90vw] h-[90vh] overflow-hidden",
          "[&>button]:hidden",
          "bg-transparent border-0 shadow-none",
        )}
      >
        <DialogTitle hidden />

        <div className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 text-zinc-50 border border-white/10">
          <MediaModalCloseButton onOpenChange={onOpenChange} />

          <div className="grid grid-cols-4 h-full w-full min-h-0">
            <section className="col-span-3 h-full min-w-0 min-h-0 flex flex-col overflow-hidden bg-black/60">
              <div className="flex-1 min-h-0 overflow-hidden">
                <MediaCarousel
                  layout="modal"
                  initialIndex={initialIndex}
                  medias={medias}
                  onIndexChange={(index) => setCurrentIndex(index)}
                  className="w-full h-full"
                />
              </div>

              <div className="h-12 shrink-0 border-t border-white/10 bg-zinc-950/40 flex items-center justify-between px-4">
                <MediaModalControls
                  media={mediaForRender}
                  onToggleLike={() => {
                    if (!mediaId) return;
                    if (toggleLike.isPending) return;
                    toggleLike.mutate();
                  }}
                />
                {/* опционально: показывай индикатор, если идет refetch */}
                {/* {isMediaFetching && <span className="text-xs text-zinc-400">Updating...</span>} */}
              </div>
            </section>

            <aside className="col-span-1 h-full min-w-0 min-h-0 flex flex-col border-l border-white/10 bg-zinc-950/35">
              <MediaModalAside
                author={author}
                createdAtText={mediaForRender.createdAt}
                media={mediaForRender}
              />
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
