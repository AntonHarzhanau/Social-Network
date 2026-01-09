// shared/components/MediaAssetDetailsPanel.tsx
import type { MediaResponse } from "@/entities/media/model/mediaResponseTypes";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useState } from "react";
import { useMediaAssetReactions } from "@/entities/media/model/useMediaAssetReactions";
import type { MediaModalAuthor } from "./MediaAssetModal";

export function MediaAssetDetailsPanel({
  author,
  media,
  enabled,
}: {
  author: MediaModalAuthor;
  media: MediaResponse;
  enabled: boolean;
}) {
  const { data, isLoading, isError } = useMediaAssetReactions(media.id, enabled);

  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* header: author */}
      <div className="flex items-center gap-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatarUrl ?? undefined} />
          <AvatarFallback>{author.username.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="font-medium leading-5 truncate">{author.username}</div>
          <div className="text-xs text-muted-foreground truncate">
            {new Date(media.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* likes */}
      <div className="pb-3 text-sm">
        {isLoading && <span className="text-muted-foreground">Загрузка реакций…</span>}
        {isError && <span className="text-destructive">Не удалось загрузить реакции</span>}
        {!isLoading && !isError && data && (
          <>
            <span className="font-medium">{data.likeCount}</span>{" "}
            <span className="text-muted-foreground">likes</span>
            {data.isLikedByCurrentUser && (
              <span className="ml-2 text-xs text-muted-foreground">(liked by you)</span>
            )}
          </>
        )}
      </div>

      {/* comments */}
      <ScrollArea className="flex-1 min-h-0 border rounded-md p-2">
        <div className="flex flex-col gap-2 text-sm">
          {isLoading && <div className="text-muted-foreground">Загрузка комментариев…</div>}
          {!isLoading && data?.comments?.length === 0 && (
            <div className="text-muted-foreground">Комментариев пока нет</div>
          )}
          {data?.comments?.map((c) => (
            <div key={c.id}>
              <span className="font-medium">{c.authorName}</span>{" "}
              <span className="text-muted-foreground">{c.text}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* input */}
      <div className="pt-3 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать комментарий…"
        />
        <Button
          type="button"
          onClick={() => {
            // заглушка: позже вызов мутации createComment(media.id, text)
            setText("");
          }}
          disabled={!text.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
