import type { UserPreview } from "@/entities/user/model/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface MediaModalAsideProps {
    author: UserPreview;
    createdAtText?: string;
    comments: Array<{ id: string; username: string; text: string }>;
    comment: string;
    setComment: (text: string) => void;
    submitComment: () => void;
}

const MediaModalAside = ({
    author,
    createdAtText,
    comments,
    comment,
    setComment,
    submitComment,
}: MediaModalAsideProps) => {
  return (
    <>
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
                <span className="font-medium text-zinc-100">{c.username}</span>{" "}
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
    </>
  );
};

export default MediaModalAside;
