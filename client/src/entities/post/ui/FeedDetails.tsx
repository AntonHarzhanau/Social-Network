import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Post } from "../model/types";
import CommentList from "@/entities/comment/ui/CommentList";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useCreateCommentMutation } from "@/entities/comment/model/useCommentMutations";
import FeedDetailsPost from "./FeedDetailsPost";

interface FeedDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

const FeedDetails = ({ post, open, onOpenChange }: FeedDetailsProps) => {
  const [commentContent, setCommentContent] = useState("");
  const createCommentMut = useCreateCommentMutation(
    post.commentThreadId,
    post.id,
  );

  const canSend =
    commentContent.trim().length > 0 && !createCommentMut.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="
          p-0
          w-screen sm:w-[95vw]
          max-w-none sm:max-w-2xl
          h-dvh sm:h-[90dvh]
          max-h-dvh sm:max-h-[90dvh]
          flex flex-col overflow-hidden
        "
      >
        <DialogTitle hidden />

        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <FeedDetailsPost post={post} />

            <div className="px-4 py-3 pb-28">
              <CommentList threadId={post.commentThreadId} />
            </div>
          </ScrollArea>
        </div>

        {/* Fixed input bar */}
        <div
          className="
            shrink-0 border-t bg-background/95 backdrop-blur
            p-3
            pb-4
            supports-[padding:env(safe-area-inset-bottom)]:pb-[calc(env(safe-area-inset-bottom)+1rem)]
          "
        >
          <div className="flex gap-2">
            <Input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button
              disabled={!canSend}
              onClick={() => {
                const text = commentContent.trim();
                if (!text) return;
                createCommentMut.mutate(text);
                setCommentContent("");
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedDetails;
