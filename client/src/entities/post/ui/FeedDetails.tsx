import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Post } from "../model/types";
import FeedCard from "./FeedCard";
import CommentList from "@/entities/comment/ui/CommentList";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useCreateCommentMutation } from "@/entities/comment/model/useCommentMutations";

interface FeedDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

const FeedDetails = ({ post, open, onOpenChange }: FeedDetailsProps) => {
  const [commentContent, setCommentContent] = useState("");
  const createCommentMut = useCreateCommentMutation(post.commentThreadId, post.id);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="">
        <DialogTitle hidden />

        <ScrollArea className="h-[85vh] w-full">
          <FeedCard post={post} />
          <CommentList threadId={post.commentThreadId} />
        </ScrollArea>
        <div className="flex sticky">
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="mt-4"
          />
          <Button
            onClick={() => {
              createCommentMut.mutate(commentContent);
              setCommentContent("");
            }}
            className="ml-2 mt-4"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedDetails;
