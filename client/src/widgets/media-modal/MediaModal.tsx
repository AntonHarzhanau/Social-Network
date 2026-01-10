import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useState } from "react";
import MediaCarousel from "@/entities/media/ui/MediaCarousel";
import { cn } from "@/shared/lib/utils";

import type { MediaResponse } from "@/entities/media/model/types";
import MediaModalAside from "./MediaModalAside";
import MediaModalCloseButton from "./MediaModalCloseButton";
import MediaModalControls from "./MediaModalControls";

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

  createdAtText?: string;
  likeCount?: number;
  isLiked?: boolean;

  onToggleLike?: () => void;
  onShare?: () => void;

  // комментарии можешь заменить на свои типы
  comments?: Array<{ id: string; username: string; text: string }>;
  onSendComment?: (text: string) => void;
};

export function MediaModal({
  open,
  onOpenChange,
  author,
  medias,
  initialIndex,
  createdAtText = "",
  onToggleLike,
  onShare,
  comments = [],
  onSendComment,
}: Props) {
  const likeCount = 15; // TODO: replace
  const [comment, setComment] = useState("");
  const submitComment = () => {
    const text = comment.trim();
    if (!text) return;
    onSendComment?.(text);
    setComment("");
  };

  const onIndexChange = (index: number) => {
    console.log("MediaModal index changed to:", index);
  };

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

          {/* 2 columns */}
          <div className="grid grid-cols-4 h-full w-full">
            <section className="col-span-3 h-full min-w-0 flex flex-col overflow-hidden bg-black/60">
              {/* Media area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MediaCarousel
                  layout="modal"
                  initialIndex={initialIndex}
                  medias={medias}
                  onIndexChange={(index) => onIndexChange(index)}
                  className="w-full h-full"
                />
              </div>

              <div className="h-12 shrink-0 border-t border-white/10 bg-zinc-950/40 flex items-center justify-between px-4">
                <MediaModalControls
                  likeCount={likeCount}
                  onToggleLike={onToggleLike}
                  onShare={onShare}
                />
              </div>
            </section>

            <aside className="col-span-1 h-full min-w-0 flex flex-col border-l border-white/10 bg-zinc-950/35">
              <MediaModalAside
                author={author}
                createdAtText={createdAtText}
                comments={comments}
                comment={comment}
                setComment={setComment}
                submitComment={submitComment}
              />
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
