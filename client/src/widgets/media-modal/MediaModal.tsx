import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { MediaDetail, MediaPreview } from "@/entities/media/model/types";
import MediaModalCloseButton from "./MediaModalCloseButton";
import MediaModalControls from "./MediaModalControls";
import MediaModalAside from "./MediaModalAside";

import { fetchMedia, toggleLikeMedia } from "@/entities/media/api/mediaApi";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { UserPreview } from "@/entities/user/model/types";
import { mediaKeys } from "@/entities/media/model/queryKeys";

import { Button } from "@/shared/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { ModalMediaCarousel } from "@/entities/media/ui/ModalMediaCarousel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: UserPreview;
  medias: MediaPreview[];
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
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) setCommentsOpen(false);
  }, [open]);

  const preview = medias[currentIndex];
  const mediaId = preview?.id;

  const { data: currentMedia, isFetching } = useQuery<MediaDetail>({
    queryKey: mediaId ? mediaKeys.detail(mediaId) : ["media", "detail", "none"],
    queryFn: () => fetchMedia(mediaId!),
    enabled: open && !!mediaId,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  // prefetch neighbors
  useEffect(() => {
    if (!open) return;

    const next = medias[currentIndex + 1]?.id;
    const prev = medias[currentIndex - 1]?.id;

    if (next)
      queryClient.prefetchQuery({
        queryKey: mediaKeys.detail(next),
        queryFn: () => fetchMedia(next),
      });

    if (prev)
      queryClient.prefetchQuery({
        queryKey: mediaKeys.detail(prev),
        queryFn: () => fetchMedia(prev),
      });
  }, [open, currentIndex, medias, queryClient]);

  const toggleLike = useMutation({
    mutationFn: () => toggleLikeMedia(mediaId!),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: mediaKeys.detail(mediaId!) });

      const prev = queryClient.getQueryData<MediaDetail>(
        mediaKeys.detail(mediaId!),
      );

      if (prev) {
        queryClient.setQueryData<MediaDetail>(mediaKeys.detail(mediaId!), {
          ...prev,
          likedByCurrentUser: !prev.likedByCurrentUser,
          likeCount: prev.likeCount + (prev.likedByCurrentUser ? -1 : 1),
        });
      }

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(mediaKeys.detail(mediaId!), ctx.prev);
    },
    onSuccess: (res) => {
      queryClient.setQueryData<MediaDetail>(
        mediaKeys.detail(mediaId!),
        (old) => {
          if (!old) return old as any;
          return { ...old, ...res };
        },
      );
    },
  });

  const mediaForRender = useMemo(
    () => currentMedia ?? medias[currentIndex],
    [currentMedia, medias, currentIndex],
  );
  if (!mediaForRender) return null;

  const liked = !!currentMedia?.likedByCurrentUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "p-0 bg-transparent border-0 shadow-none",
          "[&>button]:hidden",
          "max-w-none overflow-hidden",

          "fixed inset-0 left-0 top-0 translate-x-0 translate-y-0",
          "w-screen h-svh supports-[height:100dvh]:h-dvh!",
          "rounded-none",

          "md:inset-auto! md:left-[50%]! md:top-[50%]! md:translate-x-[-50%]! md:translate-y-[-50%]!",
          "md:w-[95vw] md:h-[90dvh] md:rounded-xl",
          "lg:min-w-[90vw] lg:h-[90vh]",
        )}
      >
        <DialogTitle hidden />

        <div
          className={cn(
            "relative h-full w-full",
            "bg-zinc-900 text-zinc-50 border border-white/10",
            "rounded-none md:rounded-xl",
            "overflow-hidden",
            "pb-[env(safe-area-inset-bottom)]",
            "overscroll-none",
            "md:overflow-y-auto",
            "lg:overflow-hidden",
          )}
        >
          <MediaModalCloseButton onOpenChange={onOpenChange} />

          <div
            className={cn(
              "grid grid-cols-1",
              "h-full grid-rows-1",
              "md:h-auto md:grid-rows-none",
              "lg:h-full lg:grid-cols-4 lg:grid-rows-1 lg:min-h-0",
            )}
          >
            <section
              className={cn(
                "min-w-0 flex flex-col bg-black/60",
                "h-full min-h-0",
                "lg:col-span-3 lg:overflow-hidden",
              )}
            >
              <div
                className={cn(
                  "relative min-w-0",
                  "flex-1 min-h-0 overflow-hidden",
                )}
              >
                <ModalMediaCarousel
                  open={open}
                  medias={medias}
                  initialIndex={initialIndex}
                  onIndexChange={setCurrentIndex}
                  className="w-full h-full"
                />

                <div className="md:hidden absolute right-3 bottom-6 z-40 flex flex-col gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-11 w-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
                    onClick={() => {
                      if (!mediaId) return;
                      if (toggleLike.isPending) return;
                      toggleLike.mutate();
                    }}
                    aria-label="Like"
                    title="Like"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        liked ? "text-red-500" : "text-white",
                      )}
                    />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-11 w-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
                    onClick={() => setCommentsOpen(true)}
                    aria-label="Comments"
                    title="Comments"
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-11 w-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
                    aria-label="Share"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>

              <div className="hidden md:flex h-12 shrink-0 border-t border-white/10 bg-zinc-950/40 items-center justify-between px-4">
                {currentMedia && (
                  <MediaModalControls
                    mediaDetail={currentMedia}
                    onToggleLike={() => {
                      if (!mediaId) return;
                      if (toggleLike.isPending) return;
                      toggleLike.mutate();
                    }}
                  />
                )}
                {isFetching && (
                  <span className="text-xs text-zinc-400">Updating...</span>
                )}
              </div>
            </section>

            <aside
              className={cn(
                "hidden md:flex flex-col min-w-0",
                "border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950/35",
                "lg:col-span-1 lg:h-full lg:min-h-0",
              )}
            >
              {currentMedia && (
                <MediaModalAside
                  author={author}
                  createdAtText={currentMedia.createdAt}
                  mediaDetail={currentMedia}
                  mode="auto"
                />
              )}
            </aside>
          </div>

          <Sheet open={commentsOpen} onOpenChange={setCommentsOpen}>
            <SheetContent
              side="bottom"
              className={cn(
                "md:hidden p-0 h-[80dvh]",
                "bg-zinc-950/95 text-zinc-50 border-t border-white/10",
                "flex flex-col min-h-0",
              )}
            >
              {currentMedia && (
                <MediaModalAside
                  author={author}
                  createdAtText={currentMedia.createdAt}
                  mediaDetail={currentMedia}
                  mode="sheet"
                />
              )}
            </SheetContent>
          </Sheet>
        </div>
      </DialogContent>
    </Dialog>
  );
}
