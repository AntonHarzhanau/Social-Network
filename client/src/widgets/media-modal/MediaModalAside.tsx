import { useCreateCommentMutation } from "@/entities/comment/model/useCommentMutations";
import CommentList from "@/entities/comment/ui/CommentList";
import type { MediaDetail } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { formatPostDate } from "@/shared/lib/date";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface MediaModalAsideProps {
  author: UserPreview;
  createdAtText?: string;
  mediaDetail: MediaDetail;
  mode?: "auto" | "sheet";
}

const MediaModalAside = ({
  author,
  createdAtText,
  mediaDetail,
  mode = "auto",
}: MediaModalAsideProps) => {
  const [comment, setComment] = useState("");

  const createComment = useCreateCommentMutation(mediaDetail.commentThreadId);
  const threadId = mediaDetail.commentThreadId;

  if (!threadId)
    return <div className="p-4 text-sm text-zinc-400">Загрузка…</div>;

  const submitComment = () => {
    if (comment.trim() === "") return;
    createComment.mutate(comment);
    setComment("");
  };

  const isSheet = mode === "sheet";

  return (
    <div className={cn("flex flex-col h-full min-h-0", "lg:h-full lg:min-h-0")}>
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-white/10 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={author?.avatarUrl ?? undefined}
            alt={author?.name}
          />
          <AvatarFallback>
            {(author?.name?.[0] ?? "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{author?.name}</div>
          {!!createdAtText && (
            <div className="text-xs text-zinc-400">
              {formatPostDate(createdAtText)}
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      {isSheet ? (
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <CommentList threadId={threadId} />
          </div>
        </ScrollArea>
      ) : (
        <>
          <div className="block lg:hidden p-4">
            <CommentList threadId={threadId} />
          </div>

          <div className="hidden lg:block flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <CommentList threadId={threadId} />
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      <div className="shrink-0 p-3 border-t border-white/10 flex items-center gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="bg-zinc-900/50 border-white/10 text-zinc-100 placeholder:text-zinc-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") submitComment();
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={submitComment}
          disabled={comment.trim() === ""}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MediaModalAside;
