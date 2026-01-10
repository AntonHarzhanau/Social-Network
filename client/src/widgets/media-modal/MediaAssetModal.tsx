import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useState } from "react";
import MediaCarousel from "@/entities/media/ui/MediaCarousel";
import { cn } from "@/shared/lib/utils";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { Heart, Share2, X } from "lucide-react";
import type { MediaResponse } from "@/entities/media/model/types";

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

  createdAtText?: string; // "5 янв в 15:22"
  likeCount?: number;
  isLiked?: boolean;

  onToggleLike?: () => void;
  onShare?: () => void;

  // комментарии можешь заменить на свои типы
  comments?: Array<{ id: string; username: string; text: string }>;
  onSendComment?: (text: string) => void;
};

export function MediaAssetModal({
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 max-w-none min-w-[90vw] h-[90vh] overflow-hidden",
          "[&>button]:hidden",
          "bg-transparent border-0 shadow-none",
        )}
      >
        <DialogTitle hidden />

        <div className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 text-zinc-50 border border-white/10">
          {/* Close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 2 columns */}
          <div className="grid grid-cols-4 h-full w-full">
            {/* LEFT: 3/4 */}
            <section className="col-span-3 h-full min-w-0 flex flex-col overflow-hidden bg-black/60">
              {/* Media area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MediaCarousel
                  layout="modal"
                  initialIndex={initialIndex}
                  medias={medias}
                  className="w-full h-full"
                />
              </div>

              {/* Bottom control panel: 48px */}
              <div className="h-12 shrink-0 border-t border-white/10 bg-zinc-950/40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-200 hover:text-white gap-2"
                    onClick={onToggleLike}
                  >
                    <Heart className="h-4 w-4" />
                    {likeCount}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-200 hover:text-white gap-2"
                    onClick={onShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Поделиться
                  </Button>
                </div>
              </div>
            </section>

            {/* RIGHT: 1/4 */}
            <aside className="col-span-1 h-full min-w-0 flex flex-col border-l border-white/10 bg-zinc-950/35">
              {/* Header: avatar + name + date */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={author.avatarUrl ?? undefined}
                    alt={author.username}
                  />
                  <AvatarFallback>
                    {(author.username?.[0] ?? "?").toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{author.username}</div>
                  {!!createdAtText && (
                    <div className="text-xs text-zinc-400">{createdAtText}</div>
                  )}
                </div>
              </div>

              {/* Comments area (scroll) */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-3 text-sm">
                  {comments.length === 0 ? (
                    <div className="text-zinc-400">
                      Оставьте первый комментарий к этой фотографии
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="leading-snug">
                        <span className="font-medium text-zinc-100">
                          {c.username}
                        </span>{" "}
                        <span className="text-zinc-300">{c.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input + send */}
              <div className="p-3 border-t border-white/10 flex items-center gap-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Написать комментарий..."
                  className="bg-zinc-900/50 border-white/10 text-zinc-100 placeholder:text-zinc-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitComment();
                  }}
                />
                <Button type="button" size="sm" onClick={submitComment}>
                  Send
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
